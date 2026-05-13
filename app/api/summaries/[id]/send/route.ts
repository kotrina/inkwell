import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { id } = await params;

  const summary = await prisma.emailSummary.findFirst({ where: { id, userId } });
  if (!summary) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const updated = await prisma.emailSummary.update({
    where: { id },
    data: { sentAt: new Date() },
  });

  return NextResponse.json(updated);
}
