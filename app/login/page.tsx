import { loginAction, seedAdminAction } from "./server-actions";

export default function LoginPage() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="card stack" style={{ padding: 24 }}>
          <div>
            <div className="badge">Auth</div>
            <h1>Email sign-in</h1>
            <p className="muted">For local development you can seed the default admin user, then sign in with email/password.</p>
          </div>
          <form action={loginAction} className="stack">
            <div className="grid">
              <label><div style={{ marginBottom: 8 }}>Email</div><input name="email" className="input" type="email" required /></label>
              <label><div style={{ marginBottom: 8 }}>Password</div><input name="password" className="input" type="password" required /></label>
            </div>
            <button className="button primary" type="submit">Sign in</button>
          </form>
          <form action={seedAdminAction}><button className="button" type="submit">Seed default admin</button></form>
        </div>
      </div>
    </div>
  );
}
