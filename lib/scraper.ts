import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export async function scrapeUrl(url: string): Promise<{ title: string; content: string }> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Klipwise/1.0)",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: No se pudo acceder a la URL`);
  }

  const html = await response.text();
  const { document } = parseHTML(html);
  const reader = new Readability(document as unknown as Document);
  const article = reader.parse();

  if (!article) {
    throw new Error("No se pudo extraer contenido de la página");
  }

  return {
    title: article.title || "Sin título",
    content: article.textContent?.trim() || "",
  };
}
