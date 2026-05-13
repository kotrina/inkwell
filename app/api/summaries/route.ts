import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const summaries = await prisma.emailSummary.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      sentAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    summaries.map((s) => ({
      ...s,
      preview: s.content.slice(0, 120).replace(/[#*\n]/g, " ").trim(),
    }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: "Contenido requerido" }, { status: 400 });

    const summary = await prisma.emailSummary.create({
      data: { userId, content },
    });

    return NextResponse.json(summary);
  } catch {
    return NextResponse.json({ error: "Error al guardar el resumen" }, { status: 500 });
  }
}
