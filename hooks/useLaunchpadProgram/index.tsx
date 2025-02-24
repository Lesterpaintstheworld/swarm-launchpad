'use client'

import { useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Connection } from '@solana/web3.js'
import { constants } from '@/lib/constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAnchorProvider } from '../useAnchor'
import { WalletSignTransactionError } from '@solana/wallet-adapter-base'
import { getLaunchpadProgram, getShareholderPDA } from './utils'
import { BN } from '@coral-xyz/anchor'
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token'
import { toast } from 'sonner'
import { Listing, MarketListing } from '@/types/listing'
import { SwarmResponse } from '@/types/api'
import { PoolAccount } from '@/types/pool'

// Define fallback RPC endpoint
const FALLBACK_RPC = 'https://api.mainnet-beta.solana.com';

// Get RPC endpoint with fallback
const getRpcEndpoint = () => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_HELIUS_RPC_KEY) {
        return `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_RPC_KEY}`;
    }
    return FALLBACK_RPC;
};

export function useLaunchpadProgram() {
    const connection = useMemo(() => {
        const endpoint = getRpcEndpoint();
        return new Connection(endpoint, {
            commitment: 'confirmed',
            wsEndpoint: undefined
        });
    }, []);

    const { publicKey } = useWallet();
    const provider = useAnchorProvider();

    const programId = useMemo(() =>
        new PublicKey(constants.investmentProgram.id),
        []
    );

    const computeMint = useMemo(() =>
        new PublicKey(constants.investmentProgram.computeMint),
        []
    );

    const ubcMint = useMemo(() =>
        new PublicKey(constants.investmentProgram.ubcMint),
        []
    );

    const program = useMemo(() =>
        getLaunchpadProgram(provider),
        [provider]
    );

    // Query all pools
    const pools = useQuery({
        queryKey: ['pools', 'all'],
        queryFn: () => program.account.pool.all(),
        enabled: !!connection && !!program
    })

    const initializePool = useMutation({
        mutationKey: ['pool', 'initialize'],
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
                tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
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
        mutationKey: ['pool', 'freeze'],
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
        mutationKey: ['remove-pool', 'freeze'],
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
    });

    const userListings = useQuery({
        queryKey: ['listings', publicKey],
        queryFn: async () => {

            if (!publicKey) throw new Error('Wallet not connected');
            if (!program) throw new Error('Program not found');

            const accounts: any[] = await program.account.shareListing.all([
                {
                    memcmp: {
                        offset: 40,
                        bytes: publicKey.toBase58()
                    }
                }
            ]);

            // Marshall Data from Listing to MarketListing in place
            accounts.forEach((acc: Listing, index: number) => {
                accounts[index] = {
                    ...acc.account,
                    listingPDA: acc.publicKey
                };
            });

            return accounts as MarketListing[];
        },
    });

    const allListings = useQuery({
        queryKey: ['all-listings'],
        queryFn: async () => {
            const accounts: any[] = await program.account.shareListing.all();

            // Marshall Data from Listing to MarketListing in place
            accounts.forEach((acc: Listing, index: number) => {
                accounts[index] = {
                    ...acc.account,
                    listingPDA: acc.publicKey
                };
            });

            return accounts as MarketListing[];
        }
    });

    return {
        program,
        programId,
        provider,
        connection,
        computeMint,
        ubcMint,
        pools,
        initializePool,
        freezePool,
        removePool,
        userListings,
        allListings,
    }
}

export function useLaunchpadProgramAccount({ poolAddress }: { poolAddress: string }) {

    const { publicKey, sendTransaction } = useWallet()
    const { program, programId, computeMint, ubcMint, connection } = useLaunchpadProgram()

    const [pool, setPool] = useState<PublicKey>(new PublicKey(poolAddress));

    useEffect(() => {
        setPool(new PublicKey(poolAddress));
    }, [poolAddress])

    // Get pool account data
    const poolAccount = useQuery({
        queryKey: ['pool', 'fetch', pool.toBase58()],
        queryFn: async () => {
            try {
                const accountInfo = await connection.getAccountInfo(pool);
                if (!accountInfo) {
                    throw new Error('Pool account not found');
                }

                return program.account.pool.fetch(pool);
            } catch (error) {
                console.error('Error fetching pool account:', error);
                throw error;
            }
        },
        enabled: !!program && !!pool,
        retry: 3, // Retry 3 times
        retryDelay: 1000, // Retry every 1 second
        staleTime: 1000 * 30 // Cache for 30 seconds
    })

    const position = useQuery({
        queryKey: ['position', publicKey, pool.toBase58()],
        queryFn: async () => {

            if (!publicKey) {
                throw new Error('Wallet not connected');
            }

            const pda = getShareholderPDA(programId, publicKey, pool);
            if (!pda) {
                throw new Error('Failed to generate shareholder PDA');
            }

            try {
                let shareholderData = await program.account.shareholder.fetch(pda);
                return shareholderData;
            } catch (error) {
                console.error('Could not retrieve shareholder data:', error);
                return {
                    shares: new BN(0),
                    availableShares: new BN(0)
                };
            }
        },
        enabled: !!publicKey && !!program && !!pool // Only run query when wallet is connected
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
            // Early validation with detailed logging
            console.log('Purchase validation:', {
                publicKey: !!publicKey,
                pool: !!pool,
                poolAccount: !!poolAccount.data,
                programId: program.programId.toString(),
                numberOfShares,
                calculatedCost,
                // Add more detailed pool data
                poolData: poolAccount.data ? {
                    totalShares: poolAccount.data.totalShares.toNumber(),
                    availableShares: poolAccount.data.availableShares.toNumber(),
                    isFrozen: poolAccount.data.isFrozen,
                    computeMint: poolAccount.data.computeMint.toString(),
                    ubcMint: poolAccount.data.ubcMint.toString(),
                    custodialAccount: poolAccount.data.custodialAccount.toString()
                } : null
            });

            if (!publicKey) throw new Error('Wallet not connected');
            if (!pool) throw new Error('Pool address is undefined');
            if (!poolAccount.data) throw new Error('Pool data not loaded');

            try {
                // Get token accounts with logging
                const senderComputeAccount = await getAssociatedTokenAddress(
                    computeMint,
                    publicKey
                );
                const senderUbcAccount = await getAssociatedTokenAddress(
                    ubcMint,
                    publicKey
                );
                const custodialComputeAccount = await getAssociatedTokenAddress(
                    computeMint,
                    poolAccount.data.custodialAccount
                );
                const custodialUbcAccount = await getAssociatedTokenAddress(
                    ubcMint,
                    poolAccount.data.custodialAccount
                );

                // Check if token accounts exist
                const [senderComputeInfo, senderUbcInfo] = await Promise.all([
                    connection.getAccountInfo(senderComputeAccount),
                    connection.getAccountInfo(senderUbcAccount)
                ]);

                console.log('Token account info:', {
                    senderComputeExists: !!senderComputeInfo,
                    senderUbcExists: !!senderUbcInfo,
                    senderCompute: senderComputeAccount.toString(),
                    senderUbc: senderUbcAccount.toString(),
                    custodialCompute: custodialComputeAccount.toString(),
                    custodialUbc: custodialUbcAccount.toString()
                });

                // Generate the shareholder PDA
                const shareholderPda = getShareholderPDA(
                    program.programId,
                    publicKey,
                    pool
                );

                if (!shareholderPda) {
                    throw new Error('Failed to generate shareholder PDA');
                }

                console.log('Transaction params:', {
                    numberOfShares: numberOfShares.toString(),
                    calculatedCost: calculatedCost.toString(),
                    accounts: {
                        pool: pool.toString(),
                        shareholder: shareholderPda.toString(),
                        computeMintAccount: poolAccount.data.computeMint.toString(),
                        ubcMintAccount: poolAccount.data.ubcMint.toString(),
                        senderComputeAccount: senderComputeAccount.toString(),
                        senderUbcAccount: senderUbcAccount.toString(),
                        custodialAccount: poolAccount.data.custodialAccount.toString(),
                        custodialComputeAccount: custodialComputeAccount.toString(),
                        custodialUbcAccount: custodialUbcAccount.toString(),
                        buyer: publicKey.toString()
                    }
                });

                console.log('Accounts:', {
                    shareholderPda: shareholderPda.toString(),
                    senderComputeAccount: senderComputeAccount.toString(),
                    senderUbcAccount: senderUbcAccount.toString(),
                    custodialComputeAccount: custodialComputeAccount.toString(),
                    custodialUbcAccount: custodialUbcAccount.toString()
                });

                toast(`Purchase transaction pending...`);

                const tx = await program.methods
                    .purchaseShares(
                        new BN(numberOfShares),
                        new BN(calculatedCost)
                    )
                    .accounts({
                        pool: new PublicKey(pool),
                        // @ts-ignore
                        shareholder: shareholderPda,
                        computeMintAccount: new PublicKey(poolAccount.data.computeMint),
                        ubcMintAccount: new PublicKey(poolAccount.data.ubcMint),
                        senderComputeAccount: new PublicKey(senderComputeAccount),
                        senderUbcAccount: new PublicKey(senderUbcAccount),
                        custodialAccount: new PublicKey(poolAccount.data.custodialAccount),
                        custodialComputeAccount: new PublicKey(custodialComputeAccount),
                        custodialUbcAccount: new PublicKey(custodialUbcAccount),
                        buyer: publicKey,
                        systemProgram: SystemProgram.programId,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
                    })
                    .rpc();

                console.log('Transaction successful:', tx);
                toast.success(`Transaction successful: ${tx}`);
                return tx;

            } catch (error) {
                console.error('Purchase shares error:', error);
                // Try to get more detailed error information
                if (error instanceof Error) {
                    console.error('Error details:', {
                        message: error.message,
                        name: error.name,
                        stack: error.stack
                    });
                }
                toast.error('Transaction failed: ' + (error as Error).message);
                throw error;
            }
        }
    });

    const createListing = useMutation({
        mutationKey: ['listing', 'create', pool.toString(), publicKey?.toBase58()],
        mutationFn: async ({
            listingId,
            numberOfShares,
            pricePerShare,
            desiredToken
        }: {
            listingId: string,
            numberOfShares: number,
            pricePerShare: number,
            desiredToken: string
        }) => {
            if (!publicKey) throw new Error('Wallet not connected');
            if (!poolAccount.data) throw new Error('Pool data not loaded');
            if (listingId.length > 32) throw new Error('Listing ID too long');
            if (!desiredToken) throw new Error('Payment token not provided');

            // Generate PDAs
            const shareholderPda = getShareholderPDA(program.programId, publicKey, pool);
            if (!shareholderPda) throw new Error('Failed to generate shareholder PDA');

            const [listingPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("listing"),
                    pool.toBuffer(),
                    publicKey.toBuffer(),
                    Buffer.from(listingId)
                ],
                program.programId
            );
            if (!listingPda) throw new Error('Failed to generate listing PDA');

            // Get transaction instead of sending directly
            const tx = await program.methods
                .createListing(
                    listingId,
                    new BN(numberOfShares),
                    new BN(pricePerShare),
                    new PublicKey(desiredToken)
                )
                .accounts({
                    shareholder: shareholderPda,
                    // @ts-ignore
                    shareListing: listingPda,
                    pool,
                    seller: publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc(); // Use .transaction() instead of .rpc()

            console.log('Transaction successful:', tx);
            toast.success(`Transaction successful: ${tx}`);
            return tx;
        }
    });

    const cancelListing = useMutation({
        mutationKey: ['listing', 'cancel', pool.toBase58(), publicKey?.toBase58()],
        mutationFn: async ({ listing, shareholder }: { listing: Listing['publicKey'], shareholder: Listing['account']['shareholder'] }) => {

            if (!publicKey) throw new Error('Wallet not connected');
            if (!pool) throw new Error('Pool not found');

            const tx = await program.methods
                .cancelListing()
                .accounts({
                    shareListing: listing,
                    shareholder: shareholder,
                    pool,
                    seller: publicKey,
                    // @ts-ignore
                    systemProgram: SystemProgram.programId
                })
                .rpc();

            console.log(tx);
            toast.success(`Transaction successful: ${tx}`);
            return tx;
        }
    });

    const buyListing = useMutation({
        mutationKey: ['listing', 'buy', pool.toBase58(), publicKey?.toBase58()],
        mutationFn: async ({ listing, swarm, poolAccount, fee }: { listing: MarketListing, swarm: SwarmResponse, poolAccount: PoolAccount, fee: number }) => {

            if (!listing) throw new Error('No listing provided');
            if (!publicKey) throw new Error('Wallet not connected');
            if (!pool) throw new Error('Pool not found');

            const buyerShareholderPDA = getShareholderPDA(programId, publicKey, pool);
            if (!buyerShareholderPDA) throw new Error('Failed to generate buyer shareholder PDA');

            let tx;
            if (listing.desiredToken.toBase58() === '11111111111111111111111111111111') {
                // Seller wants payment in SOL
                tx = await program.methods
                    .buyListingWithLamports(new BN(fee))
                    .accounts({
                        shareListing: listing.listingPDA,
                        // @ts-ignore
                        buyerShareholder: buyerShareholderPDA,
                        sellerShareholder: listing.shareholder,
                        sellerAccount: listing.seller,
                        custodialAccount: poolAccount.custodialAccount,
                        pool: listing.pool,
                        buyer: publicKey,
                        systemProgram: SystemProgram.programId
                    })
                    .rpc();
            } else {
                // Seller wants payment in an SPL token
                tx = await program.methods
                    .buyListing(new BN(fee))
                    .accounts({
                        shareListing: listing.listingPDA,
                        // @ts-ignore
                        buyerShareholder: buyerShareholderPDA,
                        sellerShareholder: listing.shareholder,
                        tokenMintAccount: listing.desiredToken,
                        buyerTokenAccount: await getAssociatedTokenAddress(listing.desiredToken, publicKey),
                        sellerAccount: listing.seller,
                        sellerTokenAccount: await getAssociatedTokenAddress(listing.desiredToken, listing.seller),
                        custodialAccount: poolAccount.custodialAccount,
                        custodialTokenAccount: await getAssociatedTokenAddress(listing.desiredToken, poolAccount.custodialAccount),
                        pool: listing.pool,
                        buyer: publicKey,
                        systemProgram: SystemProgram.programId,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
                    })
                    .rpc();
            }

            toast.success(`Transaction successful: ${tx}`);
            toast.success(`You successfully purchased ${Number(listing.numberOfShares)} share${Number(listing.numberOfShares) > 1 ? 's' : ''} of ${swarm.name}.`);
            return tx;

        }
    });

    const poolListings = useQuery({
        queryKey: ['listings', pool.toBase58()],
        queryFn: async () => {

            if (!pool) throw new Error('Pool not found');
            if (!program) throw new Error('Program not found');

            const accounts: any[] = await program.account.shareListing.all([
                {
                    memcmp: {
                        offset: 8,
                        bytes: pool.toBase58()
                    }
                }
            ]);

            // Marshall Data from Listing to MarketListing in place
            accounts.forEach((acc: Listing, index: number) => {
                accounts[index] = {
                    ...acc.account,
                    listingPDA: acc.publicKey
                };
            });

            // Only return 8 listings
            return accounts.slice(0, 8) as MarketListing[];
        },
    });

    return {
        poolAccount,
        purchaseShares,
        position,
        poolListings,
        createListing,
        cancelListing,
        buyListing
    }
}
