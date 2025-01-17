import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "@/models/Transaction";
import dbConnect from "@/lib/mongodb";
import getRedisClient from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const redis = await getRedisClient();
    await dbConnect();
    const uuid = crypto.randomUUID().replace(/-/g, "");

    // TODO: Store the ID field in your database so you can verify the payment later
    (await cookies()).set({
      name: "payment-nonce",
      value: uuid,
      httpOnly: true,
    });

    console.log(uuid);

    return NextResponse.json({ id: uuid });
  } catch (error) {}
}
