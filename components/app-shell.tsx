import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="container" style={{ width: "auto", padding: 20 }}>
          <div className="stack">
            <div>
              <div className="badge">Open Source • V2</div>
              <h2 style={{ marginBottom: 8 }}>SupportFlow AI</h2>
              <p className="muted" style={{ marginTop: 0 }}>
                AI customer support automation with RAG, Ollama, Supabase, pgvector, auth, and admin tooling.
              </p>
            </div>
            <nav className="stack" style={{ gap: 6 }}>
              <Link href="/" className="navLink">Home</Link>
              <Link href="/login" className="navLink">Login</Link>
              <Link href="/dashboard" className="navLink">Dashboard</Link>
              <Link href="/admin" className="navLink">Admin</Link>
            </nav>
            <div className="card" style={{ padding: 16 }}>
              <strong>Local mode</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                Use Ollama on your machine and Supabase locally or in the cloud.
              </p>
            </div>
          </div>
        </div>
      </aside>
      <main>{children}</main>
    </div>
  );
}
