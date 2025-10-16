import { NextResponse } from "next/server";
import { ErrorResponse, LambdaResponse } from "@/types/api";
import { error } from "console";

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const body = await req.json();

    // Forward it to API Gateway
    const res = await fetch(`${process.env.API_GATEWAY_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data: LambdaResponse = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const error: ErrorResponse = {
      error: err instanceof Error ? err.message : "Unknown error",
    };
    return NextResponse.json(error, { status: 500 });
  }
}
