'use client'
import { QueryProvider } from "@/providers/query-client";
import { SolanaProvider } from "@/providers/solana";

const Providers = ({ children }: { children: React.ReactNode }) => {

    return (
        <QueryProvider>
            <SolanaProvider>
                {children}
            </SolanaProvider>
        </QueryProvider>
    )

}

export { Providers }