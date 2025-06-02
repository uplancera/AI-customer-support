import type { ChatResponse } from "@/lib/types";
const negativeLexicon = ["broken", "angry", "upset", "error", "issue", "down", "charged", "refund", "failed", "cannot", "can't", "worse"];
const positiveLexicon = ["thanks", "great", "love", "helpful", "resolved", "awesome"];

export function classifySentiment(text: string): ChatResponse["sentiment"] {
  const lower = text.toLowerCase();
  const negativeScore = negativeLexicon.reduce((sum, token) => sum + Number(lower.includes(token)), 0);
  const positiveScore = positiveLexicon.reduce((sum, token) => sum + Number(lower.includes(token)), 0);
  if (negativeScore > positiveScore) return "negative";
  if (positiveScore > negativeScore) return "positive";
  return "neutral";
}

export function classifyIntent(text: string): ChatResponse["intent"] {
  const lower = text.toLowerCase();
  if (/(refund|money back)/.test(lower)) return "refund";
  if (/(charged|billing|invoice|payment)/.test(lower)) return "billing";
  if (/(cannot log in|login|password|access|sign in|magic link)/.test(lower)) return "account_access";
  if (/(feature|roadmap|request|would love)/.test(lower)) return "feature_request";
  if (/(error|bug|latency|crash|timeout|webhook|api|integration|not working)/.test(lower)) return "technical_support";
  return "general";
}
