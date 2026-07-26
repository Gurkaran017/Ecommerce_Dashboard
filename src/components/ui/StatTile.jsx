import { cn } from "../../lib/cn";

const TONE = {
  positive: "text-positive",
  danger: "text-danger",
  notice: "text-notice",
  muted: "text-muted",
};

/**
 * KPI figure. Display serif, tabular, hairline separated from its neighbours —
 * no card, no shadow. The delta caption is worded once; the old Stats component
 * rendered "+12% from yesterday than last period".
 */
const StatTile = ({ label, value, delta, className }) => (
  <div className={cn("px-6 py-7 first:pl-0 last:pr-0", className)}>
    <p className="meta">{label}</p>
    <p className="tnum mt-3 font-display text-[2.5rem] leading-none">{value}</p>
    {delta && (
      <p className={cn("mt-2.5 text-xs", TONE[delta.tone] ?? "text-muted")}>
        {delta.label}
      </p>
    )}
  </div>
);

export default StatTile;
