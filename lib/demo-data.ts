import type { TicketRecord } from "@/lib/types";
export const demoTickets: TicketRecord[] = [
  { id: "demo-1", subject: "Refund request after duplicate charge", customer_email: "olivia@example.com", status: "open", priority: "high", intent: "refund", sentiment: "negative", messages: [] },
  { id: "demo-2", subject: "Can't log in after password reset", customer_email: "sam@example.com", status: "pending", priority: "medium", intent: "account_access", sentiment: "neutral", messages: [] },
  { id: "demo-3", subject: "Webhook delivery latency", customer_email: "it@northstar.io", status: "open", priority: "urgent", intent: "technical_support", sentiment: "negative", messages: [] }
];
