import type { RetrievalSource } from "@/lib/types";

export function fallbackAnswer(question: string, sources: RetrievalSource[]) {
  const lower = question.toLowerCase();
  if (!sources.length) {
    return "I couldn't reach the language model and I also didn't find a matching help article. The safest next step is to escalate this ticket to a human agent with the exact error details and timeline.";
  }
  if (/(refund|charged|billing)/.test(lower)) {
    return `Based on the closest policy article, this looks billing-related. Please verify the charge timestamp, invoice ID, and whether the account shows duplicate transactions. Relevant source: ${sources[0].title}.`;
  }
  if (/(login|password|access|sign in)/.test(lower)) {
    return `The most relevant access guidance suggests reissuing a password reset, confirming the correct workspace URL, and checking whether SSO is enforced. Relevant source: ${sources[0].title}.`;
  }
  return `Here is the closest matching guidance I found: ${sources[0].content.slice(0, 240)}... Please review that article and escalate if the issue still blocks the customer.`;
}
