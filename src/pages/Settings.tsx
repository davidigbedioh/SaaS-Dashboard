export default function Settings() {
  return (
    <section className="panel card">
      <div className="cardHeader">
        <h3>Settings</h3>
        <span>Placeholders</span>
      </div>
      <div className="hr" />
      <div className="mini" style={{ maxWidth: 820 }}>
        This page is intentionally minimal. In a real SaaS, you could add:
        team management, billing, SSO toggles, audit logs, API keys, and role-based access control.
      </div>

      <div style={{ marginTop: 14, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="panel card" style={{ background: 'rgba(0,0,0,.18)' }}>
          <div style={{ fontWeight: 650, marginBottom: 6 }}>Theme</div>
          <div className="mini">Dark premium (default). Add a light theme with CSS variables.</div>
        </div>
        <div className="panel card" style={{ background: 'rgba(0,0,0,.18)' }}>
          <div style={{ fontWeight: 650, marginBottom: 6 }}>Security</div>
          <div className="mini">SSO, MFA, session management, and device trust policies.</div>
        </div>
        <div className="panel card" style={{ background: 'rgba(0,0,0,.18)' }}>
          <div style={{ fontWeight: 650, marginBottom: 6 }}>Billing</div>
          <div className="mini">Invoices, payment methods, usage-based metering.</div>
        </div>
      </div>
    </section>
  )
}
