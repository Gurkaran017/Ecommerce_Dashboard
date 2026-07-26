import { cn } from "../../lib/cn";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

/**
 * The one table in this app.
 *
 * `columns` is [{ key, header, align, width, cell(row) }].
 * `onRowActivate` makes rows keyboard-operable — the previous tables used a
 * bare `<tr onClick>`, which no keyboard user could ever reach.
 */
const DataTable = ({
  columns,
  rows,
  rowKey = (row) => row.id,
  loading = false,
  onRowActivate,
  empty,
  caption,
}) => {
  if (loading) {
    return (
      <div className="space-y-px border-t border-line">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[52px] w-full" />
        ))}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return empty ?? <EmptyState title="Nothing here yet" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[0.8125rem]">
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead>
          <tr className="border-y border-line">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  "meta whitespace-nowrap px-4 py-3 text-left font-normal first:pl-0 last:pr-0",
                  column.align === "right" && "text-right"
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const interactive = Boolean(onRowActivate);
            return (
              <tr
                key={rowKey(row)}
                {...(interactive
                  ? {
                      tabIndex: 0,
                      role: "button",
                      onClick: () => onRowActivate(row),
                      onKeyDown: (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onRowActivate(row);
                        }
                      },
                    }
                  : {})}
                className={cn(
                  "border-b border-line transition-colors ease-editorial",
                  interactive && "cursor-pointer hover:bg-plate focus:bg-plate"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 align-middle first:pl-0 last:pr-0",
                      column.align === "right" && "text-right"
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
