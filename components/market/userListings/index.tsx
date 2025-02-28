'use client'

import { Card } from "@/components/ui/card";
import { useLaunchpadProgram } from "@/hooks/useLaunchpadProgram";
import { Row, ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./columns";
import { cn } from "@/lib/utils";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { supportedTokens } from "@/data/tokens/supported";
import { MarketListing } from "@/types/listing";
import { useState, useMemo, useEffect } from "react";

interface SwarmData {
    id: string;
    name: string;
    pool?: string;
    image?: string;
    description?: string;
    role?: string;
}

// Create a global cache for pool-to-swarm mappings
if (typeof window !== 'undefined') {
    (window as Window).__poolToSwarmCache = (window as Window).__poolToSwarmCache || {};
}

const UserListings = ({ className }: { className?: string }) => {

    const { userListings } = useLaunchpadProgram();
    const { data, isLoading } = userListings;
    const { data: tokenPrices } = useTokenPrices();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    
    // Add this to fetch and cache all swarm data
    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;
        
        const fetchSwarmData = async () => {
            try {
                const response = await fetch('/api/swarms/secondary-market-available');
                if (!response.ok) throw new Error('Failed to fetch swarms');
                
                const swarms = await response.json();
                
                // Update the global cache with pool-to-swarm mappings
                swarms.forEach((swarm: SwarmData) => {
                    if (swarm.pool) {
                        (window as Window).__poolToSwarmCache = (window as Window).__poolToSwarmCache || {};
                        ((window as Window).__poolToSwarmCache as Record<string, string>)[swarm.pool] = swarm.id;
                        console.log(`Cached mapping: ${swarm.pool} -> ${swarm.id}`);
                    }
                });
                
                // Force a re-render to apply filters with the updated cache
                setColumnFilters(prev => [...prev]);
            } catch (error) {
                console.error('Error fetching swarm data for filtering:', error);
            }
        };
        
        fetchSwarmData();
    }, []);

    // Define custom sorting functions that use token prices - MOVED BEFORE CONDITIONAL RETURN
    const sortingFns = useMemo(() => ({
        pricePerShare: (rowA: Row<MarketListing>, rowB: Row<MarketListing>) => {
            const tokenA = supportedTokens.find(t => t.mint == rowA.original.desiredToken.toBase58()) || supportedTokens[0];
            const tokenB = supportedTokens.find(t => t.mint == rowB.original.desiredToken.toBase58()) || supportedTokens[0];
            
            const valueA = Number(rowA.original.pricePerShare) / tokenA.resolution;
            const valueB = Number(rowB.original.pricePerShare) / tokenB.resolution;
            
            // Always prioritize USD value for sorting
            if (tokenPrices) {
                // For SOL, use the special SOL price mapping
                const tokenMintA = tokenA.mint === '11111111111111111111111111111111' 
                    ? '11111111111111111111111111111111' 
                    : tokenA.mint;
                
                const tokenMintB = tokenB.mint === '11111111111111111111111111111111' 
                    ? '11111111111111111111111111111111' 
                    : tokenB.mint;
                
                // Get USD values - default to 0 if not available
                const usdValueA = tokenPrices.get(tokenMintA) ? valueA * tokenPrices.get(tokenMintA)! : 0;
                const usdValueB = tokenPrices.get(tokenMintB) ? valueB * tokenPrices.get(tokenMintB)! : 0;
                
                // Debug logging with more details
                console.log('Sorting pricePerShare by USD:', 
                    { 
                        tokenA: tokenA.label, 
                        tokenB: tokenB.label,
                        valueA, 
                        valueB, 
                        usdValueA, 
                        usdValueB,
                        comparison: usdValueA > usdValueB ? 'A > B' : usdValueA < usdValueB ? 'A < B' : 'A = B'
                    }
                );
                
                // Sort by USD value only
                return usdValueA > usdValueB ? 1 : usdValueA < usdValueB ? -1 : 0;
            }
            
            // If no token prices are available, we'll try to normalize the values
            // by comparing them directly, which is not ideal but better than grouping
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        },
        askingAmount: (rowA: Row<MarketListing>, rowB: Row<MarketListing>) => {
            const tokenA = supportedTokens.find(t => t.mint == rowA.original.desiredToken.toBase58()) || supportedTokens[0];
            const tokenB = supportedTokens.find(t => t.mint == rowB.original.desiredToken.toBase58()) || supportedTokens[0];
            
            const valueA = (Number(rowA.original.pricePerShare) / tokenA.resolution) * Number(rowA.original.numberOfShares);
            const valueB = (Number(rowB.original.pricePerShare) / tokenB.resolution) * Number(rowB.original.numberOfShares);
            
            // Always convert to USD for sorting
            if (tokenPrices) {
                // For SOL, use the special SOL price mapping
                const tokenMintA = tokenA.mint === '11111111111111111111111111111111' 
                    ? '11111111111111111111111111111111' 
                    : tokenA.mint;
                
                const tokenMintB = tokenB.mint === '11111111111111111111111111111111' 
                    ? '11111111111111111111111111111111' 
                    : tokenB.mint;
                
                // Get USD values - default to 0 if not available
                const usdValueA = tokenPrices.get(tokenMintA) ? valueA * tokenPrices.get(tokenMintA)! : 0;
                const usdValueB = tokenPrices.get(tokenMintB) ? valueB * tokenPrices.get(tokenMintB)! : 0;
                
                // Debug logging with more details
                console.log('Sorting askingAmount by USD:', 
                    { 
                        tokenA: tokenA.label, 
                        tokenB: tokenB.label,
                        valueA, 
                        valueB, 
                        usdValueA, 
                        usdValueB,
                        comparison: usdValueA > usdValueB ? 'A > B' : usdValueA < usdValueB ? 'A < B' : 'A = B'
                    }
                );
                
                // Sort by USD value only
                return usdValueA > usdValueB ? 1 : usdValueA < usdValueB ? -1 : 0;
            }
            
            // If no token prices are available, we'll try to normalize the values
            // by comparing them directly, which is not ideal but better than grouping
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        }
    }), [tokenPrices]);

    // Prepare data with USD values for better sorting and display
    const prepareDataWithUsdValues = () => {
        if (!data || isLoading || !tokenPrices) return [];
        
        const processedData = [...data]
            .filter(listing => listing.seller.toBase58() !== "2kzarqLiqkYj6Xgbu6pQhgCGT59dJBetL7f2QCXvihH9")
            .map(listing => {
                const token = supportedTokens.find(t => t.mint == listing.desiredToken.toBase58()) || supportedTokens[0];
                const pricePerShareInToken = Number(listing.pricePerShare) / token.resolution;
                const askingAmountInToken = pricePerShareInToken * Number(listing.numberOfShares);
                
                // For SOL, use the special SOL price mapping
                const tokenMint = token.mint === '11111111111111111111111111111111' 
                    ? '11111111111111111111111111111111' 
                    : token.mint;
                
                // Check if token is a stablecoin (USDC or USDT)
                const isStablecoin = token.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' || 
                                    token.mint === 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
            
                // Calculate USD values - for stablecoins, use 1:1 ratio
                const pricePerShareInUsd = isStablecoin 
                    ? pricePerShareInToken 
                    : (tokenPrices && tokenPrices.get(tokenMint)) 
                        ? pricePerShareInToken * tokenPrices.get(tokenMint)! 
                        : 0;
            
                const askingAmountInUsd = isStablecoin
                    ? askingAmountInToken
                    : (tokenPrices && tokenPrices.get(tokenMint)) 
                        ? askingAmountInToken * tokenPrices.get(tokenMint)! 
                        : 0;
                
                return {
                    ...listing,
                    _pricePerShareInToken: pricePerShareInToken,
                    _pricePerShareInUsd: pricePerShareInUsd,
                    _askingAmountInToken: askingAmountInToken,
                    _askingAmountInUsd: askingAmountInUsd,
                    _token: token
                };
            });
            
        // Return the processed data
        return processedData.reverse();
    };

    // Now we can have the conditional return
    if (!data || data?.length === 0) {
        return null;
    }

    return (
        <Card className={cn("w-full mb-6", className)}>
            <h4 className="mb-6">Your Listings</h4>
            <DataTable
                columns={columns}
                data={prepareDataWithUsdValues()}
                sortingFns={{
                    pricePerShare: (rowA, rowB) => {
                        // Sort by USD value
                        return rowA.original._pricePerShareInUsd > rowB.original._pricePerShareInUsd ? 1 : 
                            rowA.original._pricePerShareInUsd < rowB.original._pricePerShareInUsd ? -1 : 0;
                    },
                    askingAmount: (rowA, rowB) => {
                        // Sort by USD value
                        return rowA.original._askingAmountInUsd > rowB.original._askingAmountInUsd ? 1 : 
                            rowA.original._askingAmountInUsd < rowB.original._askingAmountInUsd ? -1 : 0;
                    }
                }}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
            />
        </Card>
    )

}

export { UserListings };
