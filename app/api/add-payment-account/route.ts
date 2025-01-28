import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import getRedisClient from "@/lib/redis";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    // const { payload } = await req.json();
    // const { worldId, amount, type } = payload;
    // const redis = await getRedisClient();

    const { payload } = await req.json();

    console.log("add payment method: from server", { payload });

    // const cachedData = await redis.get(worldId);

    // if (!cachedData) {
    //   await dbConnect();
    //   const existingUser = await User.findOne({
    //     worldId,
    //   });
    //   if (existingUser) {
    //     await redis.setEx(worldId, 3600, JSON.stringify(existingUser));
    //   }
    // }

    // const uuid = crypto.randomUUID().replace(/-/g, "");

    // // const transaction = await Transaction.createTransaction({
    // //   userId,
    // //   walletId,
    // //   amount,
    // //   type,
    // //   description,
    // //   reference: uuid,
    // // })(
    // // TODO: Store the ID field in your database so you can verify the payment later
    // const cookieStore = await cookies();
    // cookieStore.set({
    //   name: "payment-nonce",
    //   value: uuid,
    //   httpOnly: true,
    // });

    // console.log(uuid);

    return NextResponse.json({});
  } catch (error) {}
}
