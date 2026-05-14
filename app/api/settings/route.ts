import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import type { AiProvider } from "@/lib/ai-client";

const VALID_PROVIDERS: AiProvider[] = ["anthropic", "openai", "gemini"];

/** GET /api/settings — devuelve provider, si hay key configurada y outputLanguage */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiProvider: true, aiApiKeyEncrypted: true, outputLanguage: true },
  });

  return NextResponse.json({
    provider: user?.aiProvider ?? null,
    hasKey: Boolean(user?.aiApiKeyEncrypted),
    outputLanguage: user?.outputLanguage ?? "en",
  });
}

/** POST /api/settings — guarda o actualiza provider + key cifrada */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { provider, apiKey } = await req.json();

  if (!VALID_PROVIDERS.includes(provider)) {
    return NextResponse.json({ error: "Proveedor no válido" }, { status: 400 });
  }
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 10) {
    return NextResponse.json({ error: "API Key inválida" }, { status: 400 });
  }

  const aiApiKeyEncrypted = encrypt(apiKey.trim());

  await prisma.user.update({
    where: { id: userId },
    data: { aiProvider: provider, aiApiKeyEncrypted },
  });

  return NextResponse.json({ ok: true });
}

/** PATCH /api/settings — actualiza outputLanguage */
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { outputLanguage } = await req.json();

  if (!outputLanguage || typeof outputLanguage !== "string") {
    return NextResponse.json({ error: "Invalid language" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { outputLanguage },
  });

  return NextResponse.json({ ok: true });
}

/** DELETE /api/settings — elimina la key guardada */
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  await prisma.user.update({
    where: { id: userId },
    data: { aiProvider: null, aiApiKeyEncrypted: null },
  });

  return NextResponse.json({ ok: true });
}

/** Utilidad interna: obtiene la API Key descifrada del usuario (uso solo en server-side routes) */
export async function getUserApiKey(userId: string): Promise<{ provider: AiProvider; apiKey: string } | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiProvider: true, aiApiKeyEncrypted: true },
  });

  if (!user?.aiProvider || !user?.aiApiKeyEncrypted) return null;
  if (!VALID_PROVIDERS.includes(user.aiProvider as AiProvider)) return null;

  return {
    provider: user.aiProvider as AiProvider,
    apiKey: decrypt(user.aiApiKeyEncrypted),
  };
}
