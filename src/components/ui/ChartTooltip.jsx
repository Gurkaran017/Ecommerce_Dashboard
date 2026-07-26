/** Square, hairline, --surface. Recharts' default tooltip fights the system. */
const ChartTooltip = ({ active, payload, label, format }) => {
  if (!active || !payload || payload.length === 0) return null;

  const rows = format ? format(payload[0].payload, payload) : null;

  return (
    <div className="border border-line bg-surface px-3 py-2 shadow-portal">
      {label && <p className="meta mb-1">{label}</p>}
      {rows ??
        payload.map((entry) => (
          <p key={entry.dataKey} className="tnum text-xs text-ink">
            {entry.value}
          </p>
        ))}
    </div>
  );
};

export default ChartTooltip;
