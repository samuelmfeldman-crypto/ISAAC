import { NextResponse } from "next/server";
// Stripe payments not enabled in this deployment
export async function GET() {
  return NextResponse.json({ error: "Payments not enabled" }, { status: 501 });
}
