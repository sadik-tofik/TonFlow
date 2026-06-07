import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Use the actual request host so it works on any port (3000, 3001, etc.)
  const host = req.headers.get("host") ?? "localhost:3000";
  // Prefer the forwarded protocol (useful when behind proxies or on LAN).
  // Fall back to http for localhost, otherwise default to https.
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const protocol =
    forwardedProto || (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return NextResponse.json(
    {
      url: origin,
      name: "TonFlow",
      // Using the exact secure icon from TonCoach to avoid security declines
      iconUrl: "https://ton.org/download/ton_symbol.png",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    },
  );
}
