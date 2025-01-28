import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import getRedisClient from "@/lib/redis";
import { User } from "@/models/User";
import { Wallet } from "@/models/Wallet";

import { redirect } from "next/navigation";

import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Amount } from "@/types";
import { metadata } from "@/app/layout";

async function convertToCrypto(amountInUSD: number) {
  try {
    const response = await fetch(
      `https://app-backend.worldcoin.dev/public/v1/miniapps/prices?cryptoCurrencies=WLD,USDCE&fiatCurrencies=KES,USD`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }

    const { result } = await response.json();

    // Access the amount directly from the data
    const wldRate = result.prices.WLD.USD.amount;
    const usdceRate = result.prices.USDCE.USD.amount;

    // Ensure rates are numbers
    const wldRateNumber = parseFloat(wldRate) || 0;
    const usdceRateNumber = parseFloat(usdceRate) || 0;

    const amountInWLD = amountInUSD / (wldRateNumber / Math.pow(10, 6)); // Scaling down to 6 decimals
    const amountInUSDCE = amountInUSD / (usdceRateNumber / Math.pow(10, 6));

    console.log("Amount in WLD:", amountInWLD);
    console.log("Amount in USDCE:", amountInUSDCE);

    return {
      WLD: parseFloat(amountInWLD.toFixed(6)), // Convert and limit precision to 6 decimal places
      USDCE: parseFloat(amountInUSDCE.toFixed(6)),
    };
  } catch (error) {
    console.error("Error in convertToCrypto:", error);
    throw new Error("Unable to convert USD to crypto amounts.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { depositAmount } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!depositAmount) {
      console.log("Invalid amount", depositAmount);
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
