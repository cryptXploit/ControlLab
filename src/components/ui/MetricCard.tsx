
export function MetricCard({ label, value, unit = '' }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex flex-col p-3 bg-bg-surface border border-border-subtle rounded-lg">
      <span className="text-xs text-text-secondary uppercase tracking-wider mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold text-text-primary font-mono">{value}</span>
        {unit && <span className="text-xs text-text-secondary font-mono">{unit}</span>}
      </div>
    </div>
  );
}
