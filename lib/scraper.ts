import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

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
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error("No se pudo extraer contenido de la página");
  }

  return {
    title: article.title || "Sin título",
    content: article.textContent?.trim() || "",
  };
}
