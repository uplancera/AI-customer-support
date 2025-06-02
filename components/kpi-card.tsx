export function KpiCard({ label, value, detail }: { label: string; value: string; detail: string; }) {
  return (
    <div className="card kpi">
      <div className="muted">{label}</div>
      <strong>{value}</strong>
      <div className="muted">{detail}</div>
    </div>
  );
}
