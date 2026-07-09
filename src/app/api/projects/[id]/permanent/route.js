import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/Project";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  await Project.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}