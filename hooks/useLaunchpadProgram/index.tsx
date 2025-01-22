'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { constants } from '@/lib/constants'
import { useAnchorProvider } from '../useAnchor'
import { WalletAdapterNetwork, WalletSignTransactionError } from '@solana/wallet-adapter-base'
import { getLaunchpadProgram, getShareholderPDA, getTokenAccountPDA } from './utils'
import { BN } from '@coral-xyz/anchor'

import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

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
            partnerAccount,
            swarmAccount,
            investorRedistributionAccount,
            platformAccount
        }: {
            poolName: string,
            totalShares: BN,
            feeRatio: BN,
            partnerAccount: PublicKey,
            swarmAccount: PublicKey,
            investorRedistributionAccount: PublicKey,
            platformAccount: PublicKey
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
                    partnerAccount,
                    swarmAccount,
                    investorRedistributionAccount,
                    platformAccount
                )
                .accounts({
                    pool: poolPda,
                    authority: publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .transaction();
                
                // Add a recent blockhash
                tx.recentBlockhash = (await program.provider.connection.getLatestBlockhash()).blockhash;
                tx.feePayer = publicKey;
                
                // Send and confirm
                const signature = await program.provider.sendAndConfirm(tx);
                console.log('StorePool PDA:', poolPda.toBase58());
                console.log("Transaction successful:", signature);
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

    return {
        program,
        programId,
        computeMint,
        ubcMint,
        pools,
        initializePool,
        freezePool
    }
}

export function useLaunchpadProgramAccount({ poolAddress }: { poolAddress: string }) {

    const pool = new PublicKey(poolAddress);

    const { publicKey } = useWallet()
    const { program, programId, computeMint, ubcMint } = useLaunchpadProgram()
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
        mutationKey: ['shares', 'purchase', pool.toBase58, network],
        mutationFn: async ({
            numberOfShares,
            calculatedCost
        }: {
            numberOfShares: number,
            calculatedCost: number,
        }) => {
            if (!publicKey) throw new Error('Wallet not connected')
    
            // Get pool data to get the various account addresses
            const accountInfo = await program.provider.connection.getAccountInfo(pool);
            
            // Generate PDAs
            const [shareholderPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("shareholder"),
                    pool.toBuffer(),
                    publicKey.toBuffer()
                ],
                programId
            );
    
            // Get associated token accounts
            const senderComputeAccount = await getAssociatedTokenAddress(
                computeMint,
                publicKey
            );
    
            const senderUbcAccount = await getAssociatedTokenAddress(
                ubcMint,
                publicKey
            );
    
            const swarmComputeAccount = await getAssociatedTokenAddress(
                computeMint,
                poolData.swarmAccount
            );
    
            const partnerUbcAccount = await getAssociatedTokenAddress(
                ubcMint,
                poolData.partnerAccount
            );
    
            const platformUbcAccount = await getAssociatedTokenAddress(
                ubcMint,
                poolData.platformAccount
            );
    
            return program.methods
                .purchaseShares(
                    new BN(numberOfShares),
                    new BN(calculatedCost)
                )
                .accounts({
                    pool,
                    shareholder: shareholderPda,
                    computeMintAccount: computeMint,
                    ubcMintAccount: ubcMint,
                    senderComputeAccount,
                    senderUbcAccount,
                    swarmAccount: poolData.swarmAccount,
                    swarmComputeAccount,
                    partnerAccount: poolData.partnerAccount,
                    partnerUbcAccount,
                    platformAccount: poolData.platformAccount,
                    platformUbcAccount,
                    buyer: publicKey,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
                })
                .rpc()
        }
    })

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
    const createListing = useMutation({
        mutationKey: ['listing', 'create', pool.toBase58(), network],
        mutationFn: async ({
            listingId,
            numberOfShares,
            pricePerShare,
            wantedTokenMint
        }: {
            listingId: string,
            numberOfShares: number,
            pricePerShare: number,
            wantedTokenMint: PublicKey
        }) => {
            if (!publicKey) throw new Error('Wallet not connected')

            const [listingPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("listing"),
                    pool.toBuffer(),
                    publicKey.toBuffer(),
                    Buffer.from(listingId)
                ],
                program.programId
            )

            return program.methods
                .createListing(
                    listingId,
                    new BN(numberOfShares),
                    new BN(pricePerShare),
                    wantedTokenMint
                )
                .accounts({
                    shareholder: await getShareholderPDA(program.programId, publicKey, pool),
                    shareListing: listingPda,
                    pool,
                    seller: publicKey,
                    systemProgram: SystemProgram.programId
                })
                .rpc()
        }
    })

    // Cancel listing
    const cancelListing = useMutation({
        mutationKey: ['listing', 'cancel', pool.toBase58(), network],
        mutationFn: async (listing: PublicKey) => {
            if (!publicKey) throw new Error('Wallet not connected')

            return program.methods
                .cancelListing()
                .accounts({
                    shareListing: listing,
                    shareholder: await getShareholderPDA(program.programId, publicKey, pool),
                    pool,
                    seller: publicKey,
                    systemProgram: SystemProgram.programId
                })
                .rpc()
        }
    })

    // Buy listing
    const buyListing = useMutation({
        mutationKey: ['listing', 'buy', pool.toBase58(), network],
        mutationFn: async ({
            listing,
            computeMint,
            ubcMint
        }: {
            listing: PublicKey,
            computeMint: PublicKey,
            ubcMint: PublicKey
        }) => {
            if (!publicKey) throw new Error('Wallet not connected')

            return program.methods
                .buyListing()
                .accounts({
                    shareListing: listing,
                    buyerShareholder: await getShareholderPDA(program.programId, publicKey, pool),
                    // Add all required account addresses
                    pool,
                    buyer: publicKey,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
                })
                .rpc()
        }
    })

    return {
        poolAccount,
        shareholderAccount,
        purchaseShares,
        createListing,
        cancelListing,
        buyListing
    }
}