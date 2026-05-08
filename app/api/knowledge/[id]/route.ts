import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { id } = await params;

  const item = await prisma.knowledgeItem.findFirst({ where: { id, userId } });
  if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await prisma.knowledgeItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
