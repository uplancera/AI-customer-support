"use client";
import { useState } from "react";

export function IngestKnowledgeForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  async function submit() {
    const response = await fetch("/api/admin/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    const data = await response.json();
    setMessage(data.message || "Done");
    if (response.ok) { setTitle(""); setContent(""); }
  }

  return (
    <div className="card stack" style={{ padding: 20 }}>
      <div>
        <h3>Ingest knowledge</h3>
        <div className="muted">Paste a support article, FAQ, or internal runbook. The API chunks it and stores embeddings in pgvector.</div>
      </div>
      <label><div style={{ marginBottom: 8 }}>Document title</div><input value={title} onChange={(e) => setTitle(e.target.value)} className="input" /></label>
      <label><div style={{ marginBottom: 8 }}>Content</div><textarea value={content} onChange={(e) => setContent(e.target.value)} className="textarea" /></label>
      <div className="row-between"><div className="muted">{message || "Ready"}</div><button className="button primary" onClick={submit}>Index document</button></div>
    </div>
  );
}
