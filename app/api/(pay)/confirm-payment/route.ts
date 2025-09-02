import {
  MiniAppPaymentSuccessPayload,
  MiniAppPaymentErrorPayload,
} from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "@/models/Transaction";
import { ObjectId } from "mongodb";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { WorldcoinTransaction } from "@/models/WldTransaction";
import { depositUpdateWallet as updateWallet } from "@/lib/wallet/withdraw";
import { convertCrypto } from "@/lib/wallet/convertCrytpo";
import { revalidatePath, revalidateTag } from "next/cache";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
  transactionId: string;
}
// interface IResponsePayload {
//   data?:

// }
const getReferenceFromDB = async ({
  userId,
  transactionId,
}: {
  userId: string;
  transactionId: string;
}) => {
  const transaction = await Transaction.findOne({
    userId,
    _id: new ObjectId(transactionId),
  });
  return transaction.reference;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const { payload, transactionId } = (await req.json()) as IRequestPayload;
  if (!session) {
    return NextResponse.json(
      { sucess: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  console.log(payload);

  // IMPORTANT: Here we should fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
  //   const reference = getReferenceFromDB();

  const { worldId, userId } = session;

  const reference = await getReferenceFromDB({
    userId,
    transactionId,
  });

  console.log(reference);

  if (!reference) {
    return NextResponse.json({ success: false });
  }

  // 1. Check that the transaction we received from the mini app is the same one we sent
  if (payload.reference === reference) {
    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
        },
      }
    );
    const transaction = (await response.json()) as {
      transactionId: string;
      transactionHash: string;
      transactionStatus: string;
      receipientAddress: string;
      fromWalletAddress: string;

      reference: string;
      miniappId: string;

      inputToken: string;
      inputTokenAmount: number;
      network: string;

      updatedAt: string;
    };

    if (!transaction) {
      return NextResponse.json({ success: false });
    }

    console.log(" transaction data", transaction);
    // 2. Here we optimistically confirm the transaction.
    // Otherwise, you can poll until the status == mined
    if (
      transaction.reference == reference &&
      transaction.transactionStatus != "failed"
    ) {
      const { reference } = transaction;

      //// resolve concurently

      const [WldTransaction, updatedTransaction] = await Promise.all([
        await WorldcoinTransaction.createTransaction({
          transactionStatus: transaction.transactionStatus,
          transaction_id: transaction.transactionId,
          transactionHash: transaction.transactionHash,
          receipientAddress: transaction.receipientAddress,
          fromWalletAddress: transaction.fromWalletAddress,
          reference: transaction.reference,
          miniappId: transaction.miniappId,
          userId,
          walletId: worldId,
          transactionId: transactionId,

          inputToken: transaction.inputToken,
          inputTokenAmount: transaction.inputTokenAmount,
          network: transaction.network,
          updatedAt: transaction.updatedAt,
        }),

        await Transaction.findOneAndUpdate(
          { userId, reference },
          {
            status: "completed",
          },
          { new: true, runValidators: true }
        ),
      ]);

      if (!WldTransaction || !updatedTransaction) {
        return NextResponse.json({
          success: false,
          error: "failed to create transaction",
        });
      }
      // const amountInUSD = await convertCrypto(
      //   transaction.inputToken,
      //   transaction.inputTokenAmount
      // );

      // if (amountInUSD.success == false) {
      //   return NextResponse.json({
      //     success: false,
      //     error: "Failed to convert crypto",
      //   });
      // }

      // if (!amountInUSD.data) {
      //   return NextResponse.json({
      //     success: false,
      //     error: "Amount is undefined",
      //   });
      // }

      const updatedWallet = await updateWallet({
        userId,
        amount:updatedTransaction.amount || 0,
      });

      if (updatedWallet.success == false) {
        return NextResponse.json({
          success: false,
          error: "Failed to update wallet",
        });
      }

      console.log({
        WldTransaction,
        updatedTransaction,
        updatedWallet,
      });
      revalidateTag(`transactions ${userId} all`);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  }
  return NextResponse.json({ success: false });
}
