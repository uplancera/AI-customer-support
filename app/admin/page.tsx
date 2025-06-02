import { KpiCard } from "@/components/kpi-card";
import { IngestKnowledgeForm } from "./ui";
import { getAdminTickets, getKnowledgeStats } from "@/lib/queries";

export default async function AdminPage() {
  const [tickets, knowledge] = await Promise.all([getAdminTickets(), getKnowledgeStats()]);
  return (
    <div className="page">
      <div className="container stack">
        <div>
          <div className="badge">Admin</div>
          <h1>Operations dashboard</h1>
          <p className="muted">Review ticket queue health, inspect model signals, and ingest knowledge into pgvector for retrieval.</p>
        </div>
        <div className="grid-3">
          <KpiCard label="Knowledge docs" value={String(knowledge.documents)} detail="Indexed sources available to retrieval." />
          <KpiCard label="Embeddings" value={String(knowledge.chunks)} detail="Vectorized chunks stored in pgvector." />
          <KpiCard label="Escalations" value={String(tickets.filter((ticket) => ticket.priority === "urgent").length)} detail="Tickets marked urgent or at-risk." />
        </div>
        <div className="grid-2">
          <div className="card" style={{ padding: 20 }}>
            <div className="row-between"><h3>Live queue</h3><div className="badge">{tickets.length} active</div></div>
            <table className="table">
              <thead><tr><th>Ticket</th><th>Signals</th><th>Status</th></tr></thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.subject}</strong><div className="muted">{ticket.customer_email}</div></td>
                    <td><div>{ticket.intent}</div><div className="muted">{ticket.sentiment}</div></td>
                    <td>{ticket.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <IngestKnowledgeForm />
        </div>
      </div>
    </div>
  );
}
