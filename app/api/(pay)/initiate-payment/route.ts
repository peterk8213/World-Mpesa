import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { convertToCrypto } from "@/lib/wallet/crypto-equivalent";

import dbConnect from "@/lib/mongodb";
import getRedisClient from "@/lib/redis";
import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";

import { redirect } from "next/navigation";

import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Amount } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { depositAmount } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { sucess: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      parseFloat(depositAmount) < 0.1 ||
      !depositAmount ||
      isNaN(parseFloat(depositAmount))
    ) {
      return NextResponse.json(
        { sucess: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    const uuid = crypto.randomUUID().replace(/-/g, "");
    const { worldId, userId } = session;
    // const redis = await getRedisClient();

    // const cachedData = await redis.get(worldId);
    // if (cachedData) {
    //   console.log("cached data", cachedData);
    // }

    const cryptoAmount: Amount = await convertToCrypto(depositAmount);

    //console.log("Crypto amount:", cryptoAmount);

    await dbConnect();
    const existingUser = await Wallet.findOne({
      userId,
    }).populate("userId");

    if (existingUser) {
      // await redis.setEx(worldId, 3600, JSON.stringify(existingUser));
      //console.log("existingUser", existingUser);
      const worldTransaction = await Transaction.createWorldcoinTransaction({
        userId,
        walletId: existingUser._id,
        worldId,
        amount: parseFloat(depositAmount),
        reference: uuid,
        meta: cryptoAmount || {},
      });

      console.log("new User transaction created   ", worldTransaction);

      if (!worldTransaction) {
        return NextResponse.json(
          { success: false, error: "Failed to initiate payment" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          sucess: true,

          data: {
            id: uuid,
            cryptoAmount,
            wallet: process.env.ETHERIUM_ADDRESS,
            transactionId: worldTransaction._id,
          },
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.error("Failed to initiate payment", error);
    return NextResponse.json(
      {
        success: false,
        error: error || "Failed to initiate payment",
      },
      {
        status: 500,
      }
    );
  }
}
