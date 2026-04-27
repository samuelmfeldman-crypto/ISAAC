import { NextResponse } from "next/server";
// Chat API removed — ISAAC uses built-in responses (no API cost)
export async function POST() {
  return NextResponse.json({ error: "Chat API not enabled" }, { status: 501 });
}
