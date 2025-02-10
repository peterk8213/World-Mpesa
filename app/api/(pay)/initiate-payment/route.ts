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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!depositAmount) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const uuid = crypto.randomUUID().replace(/-/g, "");
    const { worldId, userId } = session;
    // const redis = await getRedisClient();

    // const cachedData = await redis.get(worldId);
    // if (cachedData) {
    //   console.log("cached data", cachedData);
    // }

    const cryptoAmount: Amount = await convertToCrypto(depositAmount);

    console.log("Crypto amount:", cryptoAmount);

    await dbConnect();
    const existingUser = await Wallet.findOne({
      userId,
    }).populate("userId");

    if (existingUser) {
      // await redis.setEx(worldId, 3600, JSON.stringify(existingUser));
      console.log(existingUser);
      const worldTransaction = await Transaction.createWorldcoinTransaction({
        userId,
        walletId: existingUser._id,
        worldId,
        amount: parseFloat(depositAmount),
        reference: uuid,
        meta: cryptoAmount || {},
      });

      console.log("new User transaction created   ", worldTransaction);
    }

    return NextResponse.json({
      id: uuid,
      cryptoAmount,
      wallet: "0x0c892815f0B058E69987920A23FBb33c834289cf",
    });
  } catch (error) {
    console.error("Failed to initiate payment", error);
  }
}
