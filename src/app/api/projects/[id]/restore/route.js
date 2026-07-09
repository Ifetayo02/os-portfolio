import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/Project";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PUT(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const restored = await Project.findByIdAndUpdate(
    params.id,
    { deleted: false, deletedAt: null },
    { new: true }
  );
  return NextResponse.json(restored);
}