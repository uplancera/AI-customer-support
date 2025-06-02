const DEFAULT_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

export async function getEmbedding(text: string) {
  const response = await fetch(`${DEFAULT_BASE_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.EMBEDDING_MODEL || "nomic-embed-text", prompt: text }),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Embedding request failed: ${response.status}`);
  const data = await response.json();
  return data.embedding as number[];
}

export async function generateText(prompt: string) {
  const response = await fetch(`${DEFAULT_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.OLLAMA_MODEL || "llama3.1:8b", prompt, stream: false }),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Generate request failed: ${response.status}`);
  const data = await response.json();
  return data.response as string;
}
