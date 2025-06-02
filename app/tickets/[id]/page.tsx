import { notFound } from "next/navigation";
import { ChatConsole } from "@/components/chat-console";
import { getTicketById } from "@/lib/queries";

export default async function TicketDetailsPage({ params }: { params: Promise<{ id: string }>; }) {
  const { id } = await params;
  const ticket = await getTicketById(id);
  if (!ticket) notFound();
  return (
    <div className="page">
      <div className="container stack">
        <div className="card" style={{ padding: 20 }}>
          <div className="row-between">
            <div>
              <div className="badge">{ticket.status}</div>
              <h1 style={{ marginBottom: 8 }}>{ticket.subject}</h1>
              <div className="muted">{ticket.customer_email}</div>
            </div>
            <div className="stack" style={{ gap: 8, textAlign: "right" }}>
              <div>Intent: {ticket.intent}</div>
              <div>Sentiment: {ticket.sentiment}</div>
              <div>Priority: {ticket.priority}</div>
            </div>
          </div>
        </div>
        <ChatConsole ticketId={ticket.id} messages={ticket.messages} />
      </div>
    </div>
  );
}
