import { clusterApiUrl } from "@solana/web3.js";

const environment = "production" as "development" | "production";

const constants = {
    environment,

    investmentProgram: {
        upgradeAuthority: '4zP3QHUvTcosCEKgJzbGJNEjTN4vcnNCHeFsCYyezAbg',
        id: '4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf',
        ubcMint: '9psiRdn9cXYVps4F1kFuoNjd2EtmqNJXrCPmRppJpump',
        computeMint: 'B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo',
    },

    rpcUrl:
        process.env.NEXT_PUBLIC_RPC_URL ||
        clusterApiUrl(environment == "production" ? "mainnet-beta" : "devnet"),

    WalletConnect: {
        projectId: "",
    },
};

export { constants };
