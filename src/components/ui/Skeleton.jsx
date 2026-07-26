import { cn } from "../../lib/cn";

const Skeleton = ({ className }) => (
  <div
    aria-hidden="true"
    className={cn("relative overflow-hidden bg-plate", className)}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-ink/[0.04] to-transparent" />
  </div>
);

export default Skeleton;
