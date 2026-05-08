import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { id } = await params;

  const article = await prisma.article.findFirst({ where: { id, userId } });
  if (!article) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(article);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { id } = await params;
  const body = await req.json();

  const article = await prisma.article.findFirst({ where: { id, userId } });
  if (!article) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const updated = await prisma.article.update({
    where: { id },
    data: { tags: body.tags ?? article.tags },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { id } = await params;

  const article = await prisma.article.findFirst({ where: { id, userId } });
  if (!article) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
