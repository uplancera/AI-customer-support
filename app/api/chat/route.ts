import { NextResponse } from "next/server";
import { z } from "zod";
import { classifyIntent, classifySentiment } from "@/lib/ai/classification";
import { answerSupportQuestion } from "@/lib/ai/support-answer";
import { appendTicketMessages, createTicketIfNeeded, updateTicketSignals } from "@/lib/queries";

const payloadSchema = z.object({
  ticketId: z.string().optional().nullable(),
  message: z.string().min(1),
  history: z.array(z.object({ id: z.string(), role: z.enum(["user", "assistant"]), content: z.string(), created_at: z.string() })).default([])
});

export async function POST(request: Request) {
  const payload = payloadSchema.parse(await request.json());
  const sentiment = classifySentiment(payload.message);
  const intent = classifyIntent(payload.message);
  const ticketId = await createTicketIfNeeded(payload.ticketId ?? null, payload.message, intent, sentiment);
  await appendTicketMessages(ticketId, [{ role: "user", content: payload.message }]);
  const answer = await answerSupportQuestion({ question: payload.message, history: payload.history, ticketId });
  await appendTicketMessages(ticketId, [{ role: "assistant", content: answer.answer }]);
  await updateTicketSignals(ticketId, { sentiment, intent });
  return NextResponse.json({ ticketId, answer: answer.answer, provider: answer.provider, reasoning: answer.reasoning, sources: answer.sources, sentiment, intent });
}
