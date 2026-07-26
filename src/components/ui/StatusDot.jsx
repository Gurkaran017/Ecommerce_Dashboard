import { cn } from "../../lib/cn";

const TONE = {
  Processing: "text-notice",
  Shipped: "text-ink",
  Delivered: "text-positive",
  Cancelled: "text-danger",
};

/** Uppercase meta text with a colour dot — never a filled pill. */
const StatusDot = ({ status, className }) => (
  <span className={cn("meta inline-flex items-center gap-1.5", className)}>
    <span
      aria-hidden="true"
      className={cn("h-1 w-1 rounded-full bg-current", TONE[status] ?? "text-muted")}
    />
    <span className={TONE[status] ?? "text-muted"}>{status}</span>
  </span>
);

export default StatusDot;
