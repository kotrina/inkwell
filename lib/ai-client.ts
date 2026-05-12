import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type AiProvider = "anthropic" | "openai" | "gemini";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

/**
 * Genera texto usando el proveedor y API key indicados.
 * Devuelve el texto generado como string.
 */
export async function generateText(
  provider: AiProvider,
  apiKey: string,
  req: AiRequest
): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens = 4096 } = req;

  if (provider === "anthropic") {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });
    const block = response.content[0];
    if (block.type !== "text") throw new Error("Respuesta inesperada de Anthropic");
    return block.text;
  }

  if (provider === "openai") {
    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Respuesta vacía de OpenAI");
    return text;
  }

  if (provider === "gemini") {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    if (!text) throw new Error("Respuesta vacía de Gemini");
    return text;
  }

  throw new Error(`Proveedor desconocido: ${provider}`);
}
