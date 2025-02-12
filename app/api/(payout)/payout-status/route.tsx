import { NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
  payload: {
    amount: number;
    method: string;
    userId: string;
    accountId: string;
  };
}

export async function POST(req: NextRequest) {
  const { payload } = (await req.json()) as IRequestPayload;
}
