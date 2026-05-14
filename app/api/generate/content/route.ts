import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateText } from "@/lib/ai-client";
import { getUserApiKey } from "@/app/api/settings/route";

const RATE_LIMIT = new Map<string, number>();

const FORMAT_INSTRUCTIONS = (lang: string): Record<string, string> => ({
  twitter: `Write a Twitter thread in ${lang}. Format:
- Start with a hook tweet (the most impactful one)
- Continue with numbered tweets (1/, 2/, etc.) of max 280 characters each
- Maximum 10 tweets
- Use emojis sparingly
- The last tweet should have a call to action or final reflection`,

  linkedin: `Write a LinkedIn post in ${lang}. Format:
- First line: powerful hook that invites expanding the post
- Short paragraphs (2-3 lines max)
- Use line breaks for breathing room
- Strategic emojis (not excessive)
- End with 3-5 relevant hashtags
- Professional but approachable tone`,

  article: `Write a long-form article in ${lang}. Format:
- Attractive title (H1)
- Introduction that hooks the reader (2 paragraphs)
- 3-5 sections with subtitles (H2)
- Conclusion with personal reflection
- Length: 800-1200 words
- Editorial tone, with a personal opinion`,
});

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
    const { articleIds, format, context } = await req.json();

    if (!articleIds?.length || !format) {
      return NextResponse.json({ error: "Artículos y formato son requeridos" }, { status: 400 });
    }

    const [articles, knowledgeItems, user] = await Promise.all([
      prisma.article.findMany({ where: { id: { in: articleIds }, userId } }),
      prisma.knowledgeItem.findMany({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { outputLanguage: true } }),
    ]);
    const outputLanguage = user?.outputLanguage ?? "en";

    if (!articles.length) {
      return NextResponse.json({ error: "No se encontraron artículos" }, { status: 404 });
    }

    const knowledgeText = knowledgeItems.length
      ? knowledgeItems
          .map((k) => `[${k.type.toUpperCase()}] ${k.title}:\n${k.content.slice(0, 1000)}`)
          .join("\n\n")
      : "No knowledge base items yet.";

    const articlesText = articles
      .map((a, i) => `## Fuente ${i + 1}: ${a.title}\n${a.content.slice(0, 3000)}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are a writing assistant that helps create authentic content. Always write your output in the following language: ${outputLanguage}. Do not use any other language in your response.
The user has a knowledge base with examples of their writing, their tone and their areas of interest.
Use that knowledge base to replicate their exact voice: their level of formality, how they structure ideas, their usual vocabulary, how they use examples, etc.
Do NOT use a generic or corporate tone. The content must sound as if the user themselves had written it.

User's knowledge base:
${knowledgeText}`;

    const userPrompt = `Based on the following articles, create content in the indicated format. Write everything in ${outputLanguage}.
${context ? `\nAdditional context or angle from the user: ${context}\n` : ""}
${FORMAT_INSTRUCTIONS(outputLanguage)[format] || FORMAT_INSTRUCTIONS(outputLanguage).article}

Content sources:
${articlesText}`;

    const content = await generateText(userAi.provider, userAi.apiKey, {
      systemPrompt,
      userPrompt,
      maxTokens: 4096,
    });

    // Marcar artículos usados como "used"
    await prisma.article.updateMany({
      where: { id: { in: articleIds }, userId },
      data: { status: "used" },
    });

    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al generar el contenido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
