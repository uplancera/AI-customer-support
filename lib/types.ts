export type TicketMessage = { id: string; role: "user" | "assistant"; content: string; created_at: string; };
export type RetrievalSource = { id: string; title: string; content: string; similarity?: number; };
export type ChatResponse = {
  ticketId: string;
  answer: string;
  provider: string;
  reasoning: string;
  sources: RetrievalSource[];
  sentiment: "positive" | "neutral" | "negative";
  intent: "billing" | "technical_support" | "refund" | "feature_request" | "account_access" | "general";
};
export type TicketRecord = {
  id: string;
  subject: string;
  customer_email: string;
  status: "open" | "pending" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  intent: ChatResponse["intent"];
  sentiment: ChatResponse["sentiment"];
  messages: TicketMessage[];
};
