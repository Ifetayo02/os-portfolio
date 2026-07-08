import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const payload = token ? verifyToken(token) : null;
  return NextResponse.json({ isAdmin: !!payload });
}