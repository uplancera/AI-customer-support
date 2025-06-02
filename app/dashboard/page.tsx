import Link from "next/link";
import { ChatConsole } from "@/components/chat-console";
import { KpiCard } from "@/components/kpi-card";
import { getDashboardSummary, getMyTickets } from "@/lib/queries";

export default async function DashboardPage() {
  const [summary, tickets] = await Promise.all([getDashboardSummary(), getMyTickets()]);
  return (
    <div className="page">
      <div className="container stack">
        <div className="row-between">
          <div>
            <div className="badge">Agent Workspace</div>
            <h1>Dashboard</h1>
            <p className="muted">Work tickets, view trends, and use the support copilot with full conversation history.</p>
          </div>
          <Link href="/admin" className="button">Admin dashboard</Link>
        </div>
        <div className="grid-3">
          <KpiCard label="Open tickets" value={String(summary.openTickets)} detail="Needs an agent response." />
          <KpiCard label="Auto-resolved" value={String(summary.autoResolved)} detail="Resolved without manual intervention." />
          <KpiCard label="Average CSAT" value={summary.averageCsat} detail="Calculated from ticket feedback." />
        </div>
        <div className="grid-2">
          <div className="card" style={{ padding: 20 }}>
            <div className="row-between"><h3>Ticket history</h3><div className="badge">{tickets.length} tickets</div></div>
            <table className="table">
              <thead><tr><th>Subject</th><th>Status</th><th>Priority</th></tr></thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><Link href={`/tickets/${ticket.id}`}><strong>{ticket.subject}</strong></Link><div className="muted">{ticket.customer_email}</div></td>
                    <td>{ticket.status}</td><td>{ticket.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ChatConsole />
        </div>
      </div>
    </div>
  );
}
