import { demoTickets } from "@/lib/demo-data";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { makeSubjectFromMessage } from "@/lib/utils";
import type { ChatResponse, TicketMessage, TicketRecord } from "@/lib/types";

export async function getDashboardSummary() {
  const supabase = createServiceRoleClient();
  try {
    const [{ count: openCount }, { count: resolvedCount }, { data: feedback }] = await Promise.all([
      supabase.from("tickets").select("*", { count: "exact", head: true }).neq("status", "resolved"),
      supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "resolved"),
      supabase.from("ticket_feedback").select("score")
    ]);
    const average = feedback?.length ? (feedback.reduce((sum, item) => sum + item.score, 0) / feedback.length).toFixed(1) : "4.7";
    return { openTickets: openCount || demoTickets.filter((ticket) => ticket.status !== "resolved").length, autoResolved: resolvedCount || 12, averageCsat: average };
  } catch {
    return { openTickets: 2, autoResolved: 12, averageCsat: "4.7" };
  }
}

export async function getMyTickets(): Promise<TicketRecord[]> {
  const supabase = createServiceRoleClient();
  try {
    const { data: tickets } = await supabase.from("tickets").select("id, subject, customer_email, status, priority, intent, sentiment").order("created_at", { ascending: false }).limit(25);
    return (tickets as TicketRecord[]) || demoTickets;
  } catch {
    return demoTickets;
  }
}

export async function getAdminTickets(): Promise<TicketRecord[]> {
  return getMyTickets();
}

export async function getKnowledgeStats() {
  const supabase = createServiceRoleClient();
  try {
    const [{ count: documents }, { count: chunks }] = await Promise.all([
      supabase.from("knowledge_documents").select("*", { count: "exact", head: true }),
      supabase.from("knowledge_chunks").select("*", { count: "exact", head: true })
    ]);
    return { documents: documents || 0, chunks: chunks || 0 };
  } catch {
    return { documents: 3, chunks: 18 };
  }
}

export async function getTicketById(id: string): Promise<TicketRecord | null> {
  const supabase = createServiceRoleClient();
  try {
    const { data: ticket } = await supabase.from("tickets").select("id, subject, customer_email, status, priority, intent, sentiment").eq("id", id).single();
    if (!ticket) return null;
    const { data: messages } = await supabase.from("ticket_messages").select("id, role, content, created_at").eq("ticket_id", id).order("created_at", { ascending: true });
    return { ...(ticket as TicketRecord), messages: (messages || []) as TicketMessage[] };
  } catch {
    return demoTickets[0];
  }
}

export async function createTicketIfNeeded(ticketId: string | null, firstMessage: string, intent: ChatResponse["intent"], sentiment: ChatResponse["sentiment"]) {
  if (ticketId) return ticketId;
  const supabase = createServiceRoleClient();
  const subject = makeSubjectFromMessage(firstMessage);
  try {
    const { data, error } = await supabase.from("tickets").insert({ subject, customer_email: "customer@example.com", status: "open", priority: sentiment === "negative" ? "high" : "medium", intent, sentiment }).select("id").single();
    if (error || !data) throw error;
    return data.id as string;
  } catch {
    return "demo-1";
  }
}

export async function appendTicketMessages(ticketId: string, messages: Array<{ role: "user" | "assistant"; content: string }>) {
  const supabase = createServiceRoleClient();
  try {
    const rows = messages.map((message) => ({ ticket_id: ticketId, role: message.role, content: message.content }));
    await supabase.from("ticket_messages").insert(rows);
  } catch {}
}

export async function updateTicketSignals(ticketId: string, signals: { intent: ChatResponse["intent"]; sentiment: ChatResponse["sentiment"]; }) {
  const supabase = createServiceRoleClient();
  try {
    await supabase.from("tickets").update({ intent: signals.intent, sentiment: signals.sentiment, priority: signals.sentiment === "negative" ? "high" : "medium" }).eq("id", ticketId);
  } catch {}
}
