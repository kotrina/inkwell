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

    const articles = await prisma.article.findMany({
      where: { id: { in: articleIds }, userId },
    });

    if (!articles.length) {
      return NextResponse.json({ error: "No se encontraron artículos" }, { status: 404 });
    }

    const articlesText = articles
      .map(
        (a, i) =>
          `## Artículo ${i + 1}: ${a.title}\nIdioma original: ${a.language}\nURL: ${a.url || "N/A"}\n\n${a.content.slice(0, 3000)}`
      )
      .join("\n\n---\n\n");

    const systemPrompt = "Eres un asistente que genera resúmenes editoriales en español.";

    const userPrompt = `Analiza los siguientes artículos y genera un resumen estructurado en español para enviar por email:

1. Si algún artículo está en inglés u otro idioma, traduce los puntos clave al español.
2. Genera un resumen con esta estructura:
   - Introducción breve (2-3 líneas) que contextualice la selección de artículos
   - Por cada artículo:
     * Título en negrita
     * 3-4 puntos clave (en viñetas)
     * Un párrafo de "Por qué es relevante" (2-3 líneas)
3. Cierra con una reflexión breve sobre las tendencias comunes entre los artículos.

Usa un tono editorial, directo y profesional. El resultado debe ser fácil de leer en un email.

---

${articlesText}`;

    const summary = await generateText(userAi.provider, userAi.apiKey, {
      systemPrompt,
      userPrompt,
      maxTokens: 4096,
    });

    return NextResponse.json({ summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al generar el resumen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
