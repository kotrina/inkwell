import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { detectLanguage } from "@/lib/language";

const VALID_STATUSES = ["new", "used", "archived", "all"];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
  }

  const articles = await prisma.article.findMany({
    where: {
      userId,
      ...(status !== "all" ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, url: true, language: true, tags: true, status: true, createdAt: true },
  });

  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const body = await req.json();
    const { title, content, url, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Título y contenido son requeridos" }, { status: 400 });
    }

    const language = detectLanguage(content);

    const article = await prisma.article.create({
      data: {
        title,
        content,
        url: url || null,
        language,
        tags: tags || [],
        status: "new",
        userId,
      },
    });

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Error al guardar el artículo" }, { status: 500 });
  }
}
