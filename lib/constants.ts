import { clusterApiUrl } from "@solana/web3.js";

const environment = "production" as "development" | "production";

const constants = {
    environment,

    investmentProgram: {
        upgradeAuthority: '4zP3QHUvTcosCEKgJzbGJNEjTN4vcnNCHeFsCYyezAbg',
        id: '4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf',
        ubcMint: '2enc37KwdGc6ezVE3hU86TusdmcxFbgNrXKjwAaibP4v',
        computeMint: '82T1mjkeVsTRhpAPpqFhHmhdcGfA9iaw1LkDGh4sGoru',
    },

    rpcUrl:
        process.env.NEXT_PUBLIC_RPC_URL ||
        clusterApiUrl(environment == "production" ? "mainnet-beta" : "devnet"),

    WalletConnect: {
        projectId: "",
    },
};

export { constants };
