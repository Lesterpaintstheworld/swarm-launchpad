// @ts-nocheck
'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Connection } from '@solana/web3.js'
import { constants } from '@/lib/constants'
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_RPC_KEY}`;
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useAnchorProvider } from '../useAnchor'
import { WalletAdapterNetwork, WalletSignTransactionError } from '@solana/wallet-adapter-base'
import { getLaunchpadProgram, getShareholderPDA } from './utils'
import { BN, BorshAccountsCoder } from '@coral-xyz/anchor'

import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { toast } from 'sonner';
import { ListingAccount } from './types';

export function useLaunchpadProgram() {

    const network = constants.environment === 'production' 
        ? WalletAdapterNetwork.Mainnet 
        : WalletAdapterNetwork.Devnet;
    const connection = new Connection(HELIUS_RPC, {
        commitment: 'confirmed',
        wsEndpoint: undefined // Helius doesn't support websockets on this endpoint
    });
    const { publicKey } = useWallet()
    const provider = useAnchorProvider(connection)
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

    const useListingsPagination = (limit: number = 20) =>{

        const [currentPage, setCurrentPage] = useState(1);
        const [totalItems, setTotalItems] = useState(0);
    
        // First, get only listing public keys to get total count
        const listingKeys = useQuery({
            queryKey: ['listing-keys'],
            queryFn: async () => {
                const accounts = await connection.getProgramAccounts(
                    program.programId,
                    {
                        filters: [
                            {
                                memcmp: {
                                    offset: 0,
                                    // @ts-ignore - Anchor's type definitions are incomplete
                                    bytes: BorshAccountsCoder.accountDiscriminator('ShareListing')
                                }
                            }
                        ],
                        dataSlice: {
                            offset: 0,
                            length: 0
                        }
                    }
                );
                setTotalItems(accounts.length);
                return accounts.map(acc => acc.pubkey);
            }
        });
    
        // Then fetch only the current page's data
        const currentPageData = useQuery({
            queryKey: ['listings', currentPage, limit],
            queryFn: async () => {
                const startIndex = (currentPage - 1) * limit;
                const pageKeys = listingKeys.data?.slice(startIndex, startIndex + limit);
    
                if (!pageKeys) return [];
    
                const listings = await Promise.all(
                    pageKeys.map(async (pubkey): Promise<ListingAccount> => {
                        const account = await program.account.shareListing.fetch(pubkey);
                        return {
                            publicKey: pubkey,
                            account: {
                                pool: account.pool,
                                seller: account.seller,
                                shareholder: account.shareholder,
                                numberOfShares: Number(account.numberOfShares),
                                pricePerShare: Number(account.pricePerShare),
                                listingId: account.listingId
                            }
                        };
                    })
                );
    
                return listings;
            },
            enabled: !!listingKeys.data
        });
    
        const totalPages = Math.ceil(totalItems / limit);
    
        const nextPage = () => {
            if (currentPage < totalPages) {
                setCurrentPage(prev => prev + 1);
            }
        };
    
        const previousPage = () => {
            if (currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }
        };
    
        const goToPage = (page: number) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
            }
        };
    
        return {
            listings: currentPageData.data || [],
            isLoading: listingKeys.isLoading || currentPageData.isLoading,
            isError: listingKeys.isError || currentPageData.isError,
            error: listingKeys.error || currentPageData.error,
            pagination: {
                currentPage,
                totalPages,
                totalItems,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1,
                nextPage,
                previousPage,
                goToPage
            },
            refresh: () => {
                listingKeys.refetch();
                currentPageData.refetch();
            }
        };
    }

    return {
        program,
        programId,
        connection,
        computeMint,
        ubcMint,
        pools,
        initializePool,
        useListingsPagination,
        freezePool,
        removePool,
        provider
    }
}

export function useLaunchpadProgramAccount({ poolAddress }: { poolAddress: string }) {
    // Add proper validation and error handling
    let pool: PublicKey | null = null;
    try {
        if (poolAddress) {
            pool = new PublicKey(poolAddress);
        }
    } catch (error) {
        console.error('Invalid pool address:', error);
        // Return safe defaults if pool address is invalid
        return {
            poolAccount: { data: null, isLoading: false, error },
            purchaseShares: { mutateAsync: async () => { throw new Error('Invalid pool address'); } },
            position: { data: null, isLoading: false, error }
        };
    }

    // Return early if pool is null
    if (!pool) {
        return {
            poolAccount: { data: null, isLoading: false, error: new Error('No pool address provided') },
            purchaseShares: { mutateAsync: async () => { throw new Error('No pool address provided'); } },
            position: { data: null, isLoading: false, error: new Error('No pool address provided') }
        };
    }

    const { publicKey } = useWallet()
    const { program, programId, computeMint, ubcMint, connection, provider } = useLaunchpadProgram()
    const network = constants.environment === 'production' 
        ? WalletAdapterNetwork.Mainnet 
        : WalletAdapterNetwork.Devnet

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
        retry: 3,
        retryDelay: 1000,
        staleTime: 30000 // Cache for 30 seconds
    })
    
    const position = useQuery({
        queryKey: ['position', publicKey, pool.toBase58()],
        queryFn: async () => {
            if (!publicKey) {
                throw new Error('Wallet not connected');
            }
            
            const pda = getShareholderPDA(program.programId, publicKey, pool);
            if (!pda) {
                throw new Error('Failed to generate shareholder PDA');
            }

            try {
                const shareholderData = await program.account.shareholder.fetch(pda);
                return shareholderData;
            } catch (error) {
                if ((error as Error).message.includes('Account does not exist')) {
                    // Return a default state for new shareholders
                    return {
                        shares: new BN(0),
                        availableShares: new BN(0)
                    };
                }
                throw error;
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
        mutationKey: ['listing', 'create', pool.toString()],
        mutationFn: async ({
            listingId,
            numberOfShares,
            pricePerShare
        }: {
            listingId: string,
            numberOfShares: number,
            pricePerShare: number
        }) => {
            if (!publicKey) throw new Error('Wallet not connected')
            if (!poolAccount.data) throw new Error('Pool data not loaded')
            if (listingId.length > 32) throw new Error('Listing ID too long')
            
            // Generate PDAs
            const [shareholderPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("shareholder"),
                    pool.toBuffer(),
                    publicKey.toBuffer()
                ],
                program.programId
            )

            const [listingPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("listing"),
                    pool.toBuffer(),
                    publicKey.toBuffer(),
                    Buffer.from(listingId)
                ],
                program.programId
            )

            console.log('Creating listing with:', {
                listingId,
                numberOfShares,
                pricePerShare,
                listingPda: listingPda.toString(),
                shareholderPda: shareholderPda.toString()
            })

            toast('Creating listing')
            const tx = await program.methods
                .createListing(
                    listingId,
                    new BN(numberOfShares),
                    new BN(pricePerShare)
                )
                .accounts({
                    shareholder: shareholderPda,
                    // @ts-ignore
                    shareListing: listingPda,
                    pool,
                    seller: publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc()
            
            toast(`Listing created: Tx: ${tx}`)
        }
    });

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
        position,
        createListing,
        // cancelListing,
        // buyListing
    }
}
