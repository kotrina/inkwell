import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateText } from "@/lib/ai-client";
import { getUserApiKey } from "@/app/api/settings/route";

const RATE_LIMIT = new Map<string, number>();

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  twitter: `Genera un hilo de Twitter en español. Formato:
- Empieza con un tweet gancho (el más impactante)
- Continúa con tweets numerados (1/, 2/, etc.) de máximo 280 caracteres cada uno
- Máximo 10 tweets
- Usa emojis con moderación
- El último tweet debe tener una llamada a la acción o reflexión final`,

  linkedin: `Genera un post de LinkedIn en español. Formato:
- Primera línea: gancho poderoso que invite a expandir el post
- Párrafos cortos (2-3 líneas máximo)
- Usa saltos de línea para dar aire
- Emojis estratégicos (no excesivos)
- Termina con 3-5 hashtags relevantes
- Tono profesional pero cercano`,

  article: `Genera un artículo largo en español. Formato:
- Título atractivo (H1)
- Introducción que enganche al lector (2 párrafos)
- 3-5 secciones con subtítulos (H2)
- Conclusión con reflexión propia
- Longitud: 800-1200 palabras
- Tono editorial, con opinión propia`,
};

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

    const [articles, knowledgeItems] = await Promise.all([
      prisma.article.findMany({ where: { id: { in: articleIds }, userId } }),
      prisma.knowledgeItem.findMany({ where: { userId } }),
    ]);

    if (!articles.length) {
      return NextResponse.json({ error: "No se encontraron artículos" }, { status: 404 });
    }

    const knowledgeText = knowledgeItems.length
      ? knowledgeItems
          .map((k) => `[${k.type.toUpperCase()}] ${k.title}:\n${k.content.slice(0, 1000)}`)
          .join("\n\n")
      : "No hay elementos en la base de conocimiento todavía.";

    const articlesText = articles
      .map((a, i) => `## Fuente ${i + 1}: ${a.title}\n${a.content.slice(0, 3000)}`)
      .join("\n\n---\n\n");

    const formatInstruction = FORMAT_INSTRUCTIONS[format] || FORMAT_INSTRUCTIONS.article;

    const systemPrompt = `Eres un asistente de escritura que ayuda a crear contenido auténtico.
El usuario tiene una base de conocimiento con ejemplos de su escritura, su tono y sus temas de interés.
Usa esa base de conocimiento para replicar su voz exacta: su nivel de formalidad, su forma de estructurar ideas, su vocabulario habitual, cómo usa los ejemplos, etc.
NO uses un tono genérico ni corporativo. El contenido debe sonar como si lo hubiera escrito el propio usuario.

Base de conocimiento del usuario:
${knowledgeText}`;

    const userPrompt = `Basándote en los siguientes artículos, crea contenido en el formato indicado.
${context ? `\nÁngulo o contexto adicional del usuario: ${context}\n` : ""}
${formatInstruction}

Fuentes de contenido:
${articlesText}`;

    const content = await generateText(userAi.provider, userAi.apiKey, {
      systemPrompt,
      userPrompt,
      maxTokens: 4096,
    });

    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al generar el contenido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
