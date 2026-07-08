import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/lib/Project";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const project = await Project.create({
      title: body.title,
      description: body.description,
      techStack: body.techStack || [],
      imageUrl: body.imageUrl || "",
      liveUrl: body.liveUrl || "",
      githubUrl: body.githubUrl || "",
      icon: body.icon || "📁",
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}