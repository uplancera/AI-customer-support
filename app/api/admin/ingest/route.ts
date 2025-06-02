import { NextResponse } from "next/server";
import { z } from "zod";
import { ingestKnowledgeDocument } from "@/lib/ai/ingest";

const schema = z.object({ title: z.string().min(2), content: z.string().min(20) });

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  const result = await ingestKnowledgeDocument(payload.title, payload.content);
  return NextResponse.json({ message: `Indexed ${result.chunks} chunks for "${payload.title}".` });
}
