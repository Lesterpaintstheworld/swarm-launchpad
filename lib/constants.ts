import { clusterApiUrl } from "@solana/web3.js";

const environment = "development" as "development" | "production";

const constants = {
    environment,

    investmentProgram: {
        id: '7pm8MaT1ZXcRPjTJ7mjxAdj4wAuCCph1bo7B7iMLjUQU'
    },

    rpcUrl:
        process.env.NEXT_PUBLIC_RPC_URL ||
        clusterApiUrl(environment == "production" ? "mainnet-beta" : "devnet"),

    WalletConnect: {
        projectId: "",
    },
};

export { constants };
