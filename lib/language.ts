// Simple language detection based on common word frequency
const SPANISH_WORDS = ["de", "la", "el", "en", "y", "que", "es", "se", "los", "del", "un", "por", "con", "una", "para", "las", "su", "al", "lo", "como"];
const ENGLISH_WORDS = ["the", "and", "is", "in", "it", "of", "to", "a", "that", "was", "for", "on", "are", "with", "as", "at", "be", "this", "have", "from"];

export function detectLanguage(text: string): string {
  const words = text.toLowerCase().split(/\s+/).slice(0, 200);

  let esCount = 0;
  let enCount = 0;

  for (const word of words) {
    if (SPANISH_WORDS.includes(word)) esCount++;
    if (ENGLISH_WORDS.includes(word)) enCount++;
  }

  if (esCount === 0 && enCount === 0) return "en";
  return esCount > enCount ? "es" : "en";
}

export const LANGUAGE_LABELS: Record<string, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
  de: "DE",
  pt: "PT",
  it: "IT",
};
