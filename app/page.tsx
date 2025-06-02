import Link from "next/link";
import { KpiCard } from "@/components/kpi-card";
import { demoTickets } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <div className="page">
      <section className="hero container">
        <div className="badge">Next.js + Supabase + pgvector + Ollama</div>
        <h1 style={{ fontSize: 56, lineHeight: 1.05, maxWidth: 800, marginBottom: 18 }}>
          Open-source AI support automation you can run locally and ship to Vercel.
        </h1>
        <p className="muted" style={{ maxWidth: 760, fontSize: 18 }}>
          This starter turns customer conversations into structured tickets, retrieves relevant knowledge
          from pgvector, classifies intent and sentiment, and gives admins a real dashboard for triage,
          ingestion, and conversation history.
        </p>
        <div className="row" style={{ marginTop: 22, flexWrap: "wrap" }}>
          <Link href="/login" className="button primary">Open the app</Link>
          <Link href="/admin" className="button">Preview admin dashboard</Link>
        </div>
      </section>
      <section className="container stack">
        <div className="grid-3">
          <KpiCard label="Automation-ready" value="RAG + intent + sentiment" detail="Grounded, explainable support responses." />
          <KpiCard label="Storage" value="Supabase + pgvector" detail="Tickets, messages, KB chunks, embeddings, and audit logs." />
          <KpiCard label="Inference" value="Ollama-first" detail="Works locally; Vercel can point to a remote Ollama host." />
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div className="row-between">
            <div>
              <h3>Sample ticket queue</h3>
              <div className="muted">Included demo data mirrors the production schema.</div>
            </div>
            <div className="badge">{demoTickets.length} seeded examples</div>
          </div>
          <table className="table">
            <thead><tr><th>Ticket</th><th>Status</th><th>Sentiment</th><th>Intent</th></tr></thead>
            <tbody>
              {demoTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td><strong>{ticket.subject}</strong><div className="muted">{ticket.customer_email}</div></td>
                  <td>{ticket.status}</td><td>{ticket.sentiment}</td><td>{ticket.intent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
