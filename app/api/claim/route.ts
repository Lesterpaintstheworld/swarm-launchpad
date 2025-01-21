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

// delegate tokens to this address:
// spl-token delegate <treasury ata> <token amount> <BACKEND_KEYPAIR.publicKey>
const BACKEND_KEYPAIR = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.BACKEND_WALLET_KEYPAIR ?? "[]")),
);

const connection = new Connection(constants.rpcUrl);

export async function POST(req: Request): Promise<Response> {
    const body = await req.json();

    const userAddress = body?.userAddress;
    const amount = 10_000 * 1_000_000;
    const tokenMint = new PublicKey(
        "B1N1HcMm4RysYz4smsXwmk2UnS8NziqKCM6Ho8i62vXo",
    );

    let user;
    try {
        user = new PublicKey(userAddress);
    } catch (e: any) {
        return Response.json(
            {
                error: "invalid public key",
                message: `could not parse ${userAddress} as public key: ${e?.message}`,
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
