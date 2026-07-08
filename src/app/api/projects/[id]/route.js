import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/Project";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token ? verifyToken(token) : null;
}

export async function PUT(req, { params }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const updated = await Project.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  await Project.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}