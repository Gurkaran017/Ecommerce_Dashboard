import { cn } from "../../lib/cn";

/** Shows where you are and how far it goes — not a bare "Page 2". */
const Pagination = ({ page, totalPages, totalItems, itemLabel = "records", onChange }) => {
  if (totalPages <= 1) return null;

  const button =
    "meta transition-colors ease-editorial hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5"
    >
      <p className="meta tnum">
        {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={button}
        >
          &larr; Prev
        </button>

        <span className={cn("tnum text-xs text-ink")}>
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className={button}
        >
          Next &rarr;
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
