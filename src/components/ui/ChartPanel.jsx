import { cn } from "../../lib/cn";

/**
 * Hairline-bordered chart container with a title, a one-line description and a
 * designed empty state — a chart with no data should say so, not render axes
 * around nothing.
 */
const ChartPanel = ({ title, description, isEmpty, emptyLabel, className, children }) => (
  <section className={cn("border border-line p-5", className)}>
    <h2 className="meta-ink">{title}</h2>
    {description && <p className="mt-1 text-xs text-muted">{description}</p>}

    <div className="mt-5">
      {isEmpty ? (
        <div className="grid h-[200px] place-items-center">
          <p className="text-xs text-muted">{emptyLabel ?? "No data yet"}</p>
        </div>
      ) : (
        children
      )}
    </div>
  </section>
);

export default ChartPanel;
