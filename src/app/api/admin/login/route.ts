import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const result = await login(password as string);
  return NextResponse.json(result);
}
