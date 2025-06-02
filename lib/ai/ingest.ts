import { createServiceRoleClient } from "@/lib/supabase/server";
import { getEmbedding } from "@/lib/ai/ollama";
import { chunkText } from "@/lib/utils";

export async function ingestKnowledgeDocument(title: string, content: string) {
  const supabase = createServiceRoleClient();
  const { data: document, error: documentError } = await supabase.from("knowledge_documents").insert({ title, content, source_type: "manual" }).select("id").single();
  if (documentError || !document) throw new Error(documentError?.message || "Failed to insert knowledge document.");
  const chunks = chunkText(content);
  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    const { error } = await supabase.from("knowledge_chunks").insert({ document_id: document.id, title, content: chunk, embedding });
    if (error) throw new Error(error.message);
  }
  return { documentId: document.id, chunks: chunks.length };
}
