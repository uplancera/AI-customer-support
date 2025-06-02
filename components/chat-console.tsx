"use client";
import { useState } from "react";
import type { ChatResponse, TicketMessage } from "@/lib/types";

export function ChatConsole({ ticketId, messages = [] }: { ticketId?: string | null; messages?: TicketMessage[]; }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TicketMessage[]>(messages);
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [pending, setPending] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const nextHistory = [...history, { id: crypto.randomUUID(), role: "user", content: input, created_at: new Date().toISOString() }];
    setHistory(nextHistory);
    setPending(true);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, message: input, history: nextHistory })
    });
    const data: ChatResponse = await response.json();
    setPending(false);
    setResult(data);
    setHistory((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: data.answer, created_at: new Date().toISOString() }]);
    setInput("");
  }

  return (
    <div className="card stack" style={{ padding: 20 }}>
      <div className="row-between">
        <div>
          <h3 style={{ marginBottom: 6 }}>Support Copilot</h3>
          <div className="muted">Ollama-grounded replies, retrieval context, sentiment, and intent classification.</div>
        </div>
        <div className="badge">{result?.provider ?? "ready"}</div>
      </div>
      <div className="chatLog">
        {history.map((message) => (
          <div key={message.id} className={`bubble ${message.role}`}>
            <strong style={{ display: "block", marginBottom: 8 }}>{message.role === "user" ? "Customer" : "Assistant"}</strong>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      <div className="grid">
        <textarea className="textarea" placeholder="Ask a support question or continue the ticket thread..." value={input} onChange={(event) => setInput(event.target.value)} />
        <div className="row-between">
          <div className="muted">{result ? `Intent: ${result.intent} • Sentiment: ${result.sentiment}` : "No prediction yet"}</div>
          <button className="button primary" disabled={pending} onClick={sendMessage}>{pending ? "Thinking..." : "Send"}</button>
        </div>
      </div>
      {result && (
        <div className="grid-2">
          <div className="card" style={{ padding: 16 }}>
            <strong>Retrieved context</strong>
            <div className="stack" style={{ marginTop: 12, gap: 10 }}>
              {result.sources.map((source) => (<div key={source.id} className="badge">{source.title}</div>))}
            </div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <strong>Why this answer</strong>
            <p className="muted" style={{ marginBottom: 0 }}>{result.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
}
