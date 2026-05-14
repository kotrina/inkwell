import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateText } from "@/lib/ai-client";
import { getUserApiKey } from "@/app/api/settings/route";

const RATE_LIMIT = new Map<string, number>();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  // Verificar que el usuario tiene API Key configurada
  const userAi = await getUserApiKey(userId);
  if (!userAi) {
    return NextResponse.json(
      { error: "No tienes una API Key configurada. Ve a Configuración para añadirla.", code: "NO_API_KEY" },
      { status: 402 }
    );
  }

  const now = Date.now();
  const lastRequest = RATE_LIMIT.get(userId) ?? 0;
  if (now - lastRequest < 6000) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Espera unos segundos." }, { status: 429 });
  }
  RATE_LIMIT.set(userId, now);

  try {
    const { articleIds } = await req.json();

    if (!articleIds?.length) {
      return NextResponse.json({ error: "Selecciona al menos un artículo" }, { status: 400 });
    }

    const [articles, user] = await Promise.all([
      prisma.article.findMany({ where: { id: { in: articleIds }, userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { outputLanguage: true } }),
    ]);
    const outputLanguage = user?.outputLanguage ?? "en";

    if (!articles.length) {
      return NextResponse.json({ error: "No se encontraron artículos" }, { status: 404 });
    }

    const articlesText = articles
      .map(
        (a, i) =>
          `## Article ${i + 1}: ${a.title}\nOriginal language: ${a.language}\nURL: ${a.url || "N/A"}\n\n${a.content.slice(0, 3000)}`
      )
      .join("\n\n---\n\n");

    const systemPrompt = `You are an assistant that generates editorial digests. Always write your output in the following language: ${outputLanguage}. Do not use any other language in your response.`;

    const userPrompt = `Analyse the following articles and generate a structured editorial digest to send by email. Write everything in ${outputLanguage}.

1. If any article is in a different language, translate the key points into ${outputLanguage}.
2. Generate a digest with this structure:
   - Brief introduction (2-3 lines) contextualising the selection of articles
   - For each article:
     * Title in bold
     * 3-4 key points (bullet points)
     * A "Why it matters" paragraph (2-3 lines)
3. Close with a short reflection on the common trends across the articles.

Use an editorial, direct and professional tone. The result should be easy to read in an email.

---

${articlesText}`;

    const summary = await generateText(userAi.provider, userAi.apiKey, {
      systemPrompt,
      userPrompt,
      maxTokens: 4096,
    });

    // Guardar el resumen generado
    const emailSummary = await prisma.emailSummary.create({
      data: { userId, content: summary },
    });

    // Marcar artículos como "used" y actualizar lastSummaryAt
    await prisma.article.updateMany({
      where: { id: { in: articleIds }, userId },
      data: { status: "used", lastSummaryAt: emailSummary.createdAt },
    });

    return NextResponse.json({ summary, summaryId: emailSummary.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al generar el resumen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
