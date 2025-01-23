'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from '@solana/web3.js'
import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { getMint } from "@solana/spl-token";
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { constants } from '@/lib/constants'
import { useAnchorProvider } from '../useAnchor'
import { WalletAdapterNetwork, WalletSignTransactionError } from '@solana/wallet-adapter-base'
import { getLaunchpadProgram, getShareholderPDA, getTokenAccountPDA } from './utils'
import { BN } from '@coral-xyz/anchor'

import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { toast } from 'sonner';

export function useLaunchpadProgram() {

    const network = constants.environment === 'production' 
        ? WalletAdapterNetwork.Mainnet 
        : WalletAdapterNetwork.Devnet;
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const provider = useAnchorProvider()
    const programId = useMemo(() => new PublicKey(constants.investmentProgram.id), [network])
    const computeMint = useMemo(() => new PublicKey(constants.investmentProgram.computeMint), [network])
    const ubcMint = useMemo(() => new PublicKey(constants.investmentProgram.ubcMint), [network])
    const program = useMemo(() => getLaunchpadProgram(provider, programId), [programId, provider])

    // Query all pools
    const pools = useQuery({
        queryKey: ['pools', 'all', network],
        queryFn: () => program.account.pool.all(),
        enabled: !!connection && !!program
    })

    const initializePool = useMutation({
        mutationKey: ['pool', 'initialize', network],
        mutationFn: async ({
            poolName,
            totalShares,
            feeRatio,
            custodialAccount,
        }: {
            poolName: string,
            totalShares: BN,
            feeRatio: BN,
            custodialAccount: PublicKey,
        }) => {
            if (!publicKey || !program) {
                throw new Error('Wallet not connected or program not initialized');
            }
    
            try {
                // Build transaction first
                const [poolPda] = PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("pool"),
                        publicKey.toBuffer(),
                        Buffer.from(poolName)
                    ],
                    programId
                );

                
                // Get the transaction object first
                const tx = await program.methods
                .initialize(
                    poolName,
                    totalShares,
                    feeRatio,
                    computeMint,
                    ubcMint,
                    custodialAccount,
                )
                .accounts({
                    // @ts-ignore
                    pool: poolPda,
                    authority: publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .transaction();
                
                // Add a recent blockhash
                tx.recentBlockhash = (await program.provider.connection.getLatestBlockhash()).blockhash;
                tx.feePayer = publicKey;
                
                // Send and confirm
                // @ts-ignore
                const signature = await program.provider.sendAndConfirm(tx);
                toast(`Pool Address: ${poolPda.toBase58()}`, { duration: 20000 });
                return signature;

            } catch (error) {
                console.error("Detailed error:", error);
                if (error instanceof WalletSignTransactionError) {
                    throw new Error(`Failed to sign transaction: ${error.message}`);
                }
                throw error;
            }
        }
    });

    // Freeze/unfreeze pool
    const freezePool = useMutation({
        mutationKey: ['pool', 'freeze', network],
        mutationFn: async ({ pool, state }: { pool: PublicKey, state: boolean }) => {
            if (!publicKey) throw new Error('Wallet not connected')

            return program.methods
                .freezePool(state)
                .accounts({
                    pool,
                    authority: publicKey
                })
                .rpc()
        }
    })
    
    // Freeze/unfreeze pool
    const removePool = useMutation({
        mutationKey: ['remove-pool', 'freeze', network],
        mutationFn: async ({ pool }: { pool: PublicKey }) => {
            if (!publicKey) throw new Error('Wallet not connected')

            return program.methods
                .removePool()
                .accounts({
                    pool,
                    authority: publicKey
                })
                .rpc()
        }
    })

    return {
        program,
        programId,
        connection,
        computeMint,
        ubcMint,
        pools,
        initializePool,
        freezePool,
        removePool,
        provider
    }
}

export function useLaunchpadProgramAccount({ poolAddress }: { poolAddress: string }) {

    const pool = new PublicKey(poolAddress);

    const { publicKey } = useWallet()
    const { program, programId, computeMint, ubcMint, connection, provider } = useLaunchpadProgram()
    const network = constants.environment === 'production' 
        ? WalletAdapterNetwork.Mainnet 
        : WalletAdapterNetwork.Devnet

    // Get pool account data
    const poolAccount = useQuery({
        queryKey: ['pool', 'fetch', pool.toBase58()],
        queryFn: async () => {
            const accountInfo = await program.provider.connection.getAccountInfo(pool);
            if (!accountInfo) {
                throw new Error('Pool account not found');
            }
            
            return program.account.pool.fetch(pool);
        },
        enabled: !!program
    })

    const purchaseShares = useMutation({
        mutationKey: ['shares', 'purchase', pool?.toString() ?? 'unknown'],
        mutationFn: async ({
            numberOfShares,
            calculatedCost
        }: {
            numberOfShares: number,
            calculatedCost: number
        }) => {
            // Early validation
            if (!publicKey) throw new Error('Wallet not connected');
            if (!pool) throw new Error('Pool address is undefined');
            if (!poolAccount.data) throw new Error('Pool data not loaded');
    
            try {
                // Get token accounts
                const senderComputeAccount = await getAssociatedTokenAddress(
                    computeMint,
                    publicKey
                );
                const senderUbcAccount = await getAssociatedTokenAddress(
                    ubcMint, 
                    publicKey
                );
                const custodialComputeAccount = await getAssociatedTokenAddress(
                    computeMint,  // Use computeMint, not ubcMint
                    poolAccount.data.custodialAccount
                );
                const custodialUbcAccount = await getAssociatedTokenAddress(
                    ubcMint,  // Keep this as ubcMint
                    poolAccount.data.custodialAccount
                );
    
                // Generate the shareholder PDA
                const [shareholderPda] = PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("shareholder"),
                        pool.toBuffer(),
                        publicKey.toBuffer()
                    ],
                    program.programId
                );

                const computeTransferIx = createTransferInstruction(
                    senderComputeAccount,       // from
                    custodialComputeAccount,    // to
                    publicKey,                  // authority
                    calculatedCost * Math.pow(10, 6)  // amount in token units
                );
                
                // If UBC needs to be transferred as well, create that instruction
                const ubcTransferIx = createTransferInstruction(
                    senderUbcAccount,          // from
                    custodialUbcAccount,       // to
                    publicKey,                 // authority
                    calculatedCost * Math.pow(10, 6)  // amount in token units
                );
    
                // Send the purchase transaction
                // return await program.methods
                const tx = await program.methods
                    .purchaseShares(
                        new BN(numberOfShares),
                        new BN(calculatedCost * Math.pow(10, 6))
                    )
                    .accounts({
                        pool,
                        shareholder: shareholderPda,
                        computeMintAccount: poolAccount.data.computeMint,
                        ubcMintAccount: poolAccount.data.ubcMint,
                        senderComputeAccount,
                        senderUbcAccount,
                        custodialAccount: poolAccount.data.custodialAccount,
                        custodialComputeAccount,
                        custodialUbcAccount,
                        buyer: publicKey,
                        systemProgram: SystemProgram.programId,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
                    })
                    .preInstructions([
                        computeTransferIx,
                        ubcTransferIx
                    ])
                    .rpc();
                
                    toast(`Success! Your transaction signature is: ${tx}`, { duration: 20000 });

            } catch (error) {
                console.error('Purchase shares error:', error);
                throw error;
            }
        }
    });

    // Get shareholder account data if wallet is connected
    const shareholderAccount = useQuery({
        queryKey: ['shareholder', 'fetch', pool.toBase58(), publicKey?.toBase58(), network],
        queryFn: async () => {
            if (!publicKey) throw new Error('Wallet not connected')
            const pda = await getShareholderPDA(program.programId, publicKey, pool)
            if (!pda) throw new Error('Failed to generate shareholder PDA')
            return program.account.shareholder.fetch(pda)
        },
        enabled: !!pool && !!publicKey && !!program
    })

    // Create share listing
    // const createListing = useMutation({
    //     mutationKey: ['listing', 'create', pool.toBase58(), network],
    //     mutationFn: async ({
    //         listingId,
    //         numberOfShares,
    //         pricePerShare,
    //         wantedTokenMint
    //     }: {
    //         listingId: string,
    //         numberOfShares: number,
    //         pricePerShare: number,
    //         wantedTokenMint: PublicKey
    //     }) => {
    //         if (!publicKey) throw new Error('Wallet not connected')

    //         const [listingPda] = PublicKey.findProgramAddressSync(
    //             [
    //                 Buffer.from("listing"),
    //                 pool.toBuffer(),
    //                 publicKey.toBuffer(),
    //                 Buffer.from(listingId)
    //             ],
    //             program.programId
    //         )

    //         return program.methods
    //             .createListing(
    //                 listingId,
    //                 new BN(numberOfShares),
    //                 new BN(pricePerShare),
    //                 wantedTokenMint
    //             )
    //             .accounts({
    //                 shareholder: await getShareholderPDA(program.programId, publicKey, pool),
    //                 shareListing: listingPda,
    //                 pool,
    //                 seller: publicKey,
    //                 systemProgram: SystemProgram.programId
    //             })
    //             .rpc()
    //     }
    // })

    // Cancel listing
    // const cancelListing = useMutation({
    //     mutationKey: ['listing', 'cancel', pool.toBase58(), network],
    //     mutationFn: async (listing: PublicKey) => {
    //         if (!publicKey) throw new Error('Wallet not connected')

    //         return program.methods
    //             .cancelListing()
    //             .accounts({
    //                 shareListing: listing,
    //                 shareholder: await getShareholderPDA(program.programId, publicKey, pool),
    //                 pool,
    //                 seller: publicKey,
    //                 systemProgram: SystemProgram.programId
    //             })
    //             .rpc()
    //     }
    // })

    // Buy listing
    // const buyListing = useMutation({
    //     mutationKey: ['listing', 'buy', pool.toBase58(), network],
    //     mutationFn: async ({
    //         listing,
    //         computeMint,
    //         ubcMint
    //     }: {
    //         listing: PublicKey,
    //         computeMint: PublicKey,
    //         ubcMint: PublicKey
    //     }) => {
    //         if (!publicKey) throw new Error('Wallet not connected')

    //         return program.methods
    //             .buyListing()
    //             .accounts({
    //                 shareListing: listing,
    //                 buyerShareholder: await getShareholderPDA(program.programId, publicKey, pool),
    //                 // Add all required account addresses
    //                 pool,
    //                 buyer: publicKey,
    //                 systemProgram: SystemProgram.programId,
    //                 tokenProgram: TOKEN_PROGRAM_ID,
    //                 associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
    //             })
    //             .rpc()
    //     }
    // })

    return {
        poolAccount,
        purchaseShares,
        shareholderAccount,
        // createListing,
        // cancelListing,
        // buyListing
    }
}