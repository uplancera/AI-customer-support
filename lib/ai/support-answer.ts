import { generateText } from "@/lib/ai/ollama";
import { fallbackAnswer } from "@/lib/ai/support-fallback";
import { retrieveKnowledge } from "@/lib/ai/vector-search";
import type { TicketMessage } from "@/lib/types";

export async function answerSupportQuestion({ question, history }: { question: string; history: TicketMessage[]; ticketId: string; }) {
  const sources = await retrieveKnowledge(question, Number(process.env.RAG_TOP_K || 4));
  const context = sources.map((source, index) => `[${index + 1}] ${source.title}\n${source.content}`).join("\n\n");
  const transcript = history.slice(-6).map((message) => `${message.role}: ${message.content}`).join("\n");
  const prompt = [
    "You are a senior customer support AI assistant.",
    "Use only the provided context. If the context is insufficient, say that clearly and offer the next best support step.",
    "",
    "Conversation history:",
    transcript || "No prior history.",
    "",
    "Retrieved context:",
    context || "No knowledge base context found.",
    "",
    `Customer question: ${question}`,
    "",
    "Write a concise, empathetic answer and avoid making up policy."
  ].join("\n");

  try {
    const answer = await generateText(prompt);
    return {
      answer: answer.trim(),
      provider: "ollama",
      reasoning: sources.length ? "Answer grounded in pgvector retrieval results and recent ticket history." : "Answer generated without retrieved documents, so it may require manual review.",
      sources
    };
  } catch (error) {
    return {
      answer: fallbackAnswer(question, sources),
      provider: "fallback",
      reasoning: `Fell back to deterministic support response because Ollama was unavailable: ${String(error)}`,
      sources
    };
  }
}
