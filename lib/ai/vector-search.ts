import { createServiceRoleClient } from "@/lib/supabase/server";
import { getEmbedding } from "@/lib/ai/ollama";
import type { RetrievalSource } from "@/lib/types";

export async function retrieveKnowledge(query: string, matchCount = 4): Promise<RetrievalSource[]> {
  const supabase = createServiceRoleClient();
  try {
    const embedding = await getEmbedding(query);
    const { data, error } = await supabase.rpc("match_knowledge_chunks", { query_embedding: embedding, match_count: matchCount });
    if (error) throw error;
    return (data || []).map((item: any) => ({ id: item.id, title: item.title, content: item.content, similarity: item.similarity }));
  } catch {
    const { data } = await supabase.from("knowledge_chunks").select("id, title, content").limit(matchCount);
    return (data || []) as RetrievalSource[];
  }
}
