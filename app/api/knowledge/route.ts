import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const items = await prisma.knowledgeItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, url: true, type: true, createdAt: true },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const { title, content, url, type } = await req.json();

    if (!title || !content || !type) {
      return NextResponse.json({ error: "Título, contenido y tipo son requeridos" }, { status: 400 });
    }

    const item = await prisma.knowledgeItem.create({
      data: { title, content, url: url || null, type, userId },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
