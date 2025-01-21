import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import {
    createAssociatedTokenAccountIdempotentInstruction,
    createTransferInstruction,
    getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { constants } from "@/lib/constants";
import holders from "./holders.json";

const TREASURY_ADDRESS = new PublicKey(
    "Ax6MPHrXAAZhDe241BL8R5hkPKKtEpTYDZKS1xb1apaw",
);

// Safely create keypair with fallback for development
const BACKEND_KEYPAIR = process.env.BACKEND_WALLET_KEYPAIR 
    ? Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.BACKEND_WALLET_KEYPAIR))
      )
    : Keypair.generate(); // Generate a dummy keypair if env var is missing

const connection = new Connection(constants.rpcUrl);

export async function POST(req: Request): Promise<Response> {
    // Check for backend wallet configuration
    if (!process.env.BACKEND_WALLET_KEYPAIR) {
        return Response.json(
            {
                error: "server_error",
                message: "Backend wallet not configured",
            },
            { status: 500 },
        );
    }
    const body = await req.json();

    const userAddress = body?.userAddress;
    const amount = 10_000 * 1_000_000;
    const tokenMint = new PublicKey(
        "B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo",
    );

    let user;
    try {
        user = new PublicKey(userAddress);
    } catch (e: unknown) {
        const error = e as Error;
        return Response.json(
            {
                error: "invalid public key",
                message: `could not parse ${userAddress} as public key: ${error?.message}`,
            },
            { status: 400 },
        );
    }

    if (!holders.includes(user.toBase58())) {
        return Response.json(
            {
                error: "not authorized",
                message: `${user} is not authorized to claim tokens`,
            },
            { status: 401 },
        );
    }

    const fromAta = getAssociatedTokenAddressSync(tokenMint, TREASURY_ADDRESS);
    const toAta = getAssociatedTokenAddressSync(tokenMint, user);

    const toAtaSignatures = await connection.getSignaturesForAddress(toAta);
    if (toAtaSignatures.length > 0) {
        return Response.json(
            {
                error: "aleady claimed",
                message: `${toAta} has on-chain activity`,
            },
            { status: 401 },
        );
    }

    const transaction = new Transaction();

    transaction.add(
        createAssociatedTokenAccountIdempotentInstruction(
            user,
            toAta,
            user,
            tokenMint,
        ),
        createTransferInstruction(
            fromAta,
            toAta,
            BACKEND_KEYPAIR.publicKey,
            amount,
        ),
    );

    const blockhashInfo = await connection.getLatestBlockhash("finalized");
    transaction.feePayer = user;
    transaction.recentBlockhash = blockhashInfo.blockhash;
    transaction.partialSign(BACKEND_KEYPAIR);

    return Response.json({
        blockhashInfo,
        transaction: transaction
            .serialize({ requireAllSignatures: false })
            .toString("base64"),
    });
}
