import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const usePermissions = (wallet?: PublicKey) => {

    const [id, setId] = useState<PublicKey | undefined | null>(wallet);

    // Listen for wallet changes
    useEffect(() => { setId(wallet) }, [wallet]);

    const { data: permissions, isLoading, error } = useQuery({
        queryKey: ['permissions', id?.toBase58()],
        queryFn: async () => {

            const response = await fetch(`/api/permissions/${id.toBase58()}`);

            const data = await response.json();

            if (response.ok) {
                return data as string[];
            }

            throw new Error(data.data);

        },
        enabled: !!id,
        gcTime: 30, // 30 seconds
        staleTime: 30, // 30 seconds
        refetchOnWindowFocus: false,
    });

    return { permissions, isLoading, error };
}

export { usePermissions };