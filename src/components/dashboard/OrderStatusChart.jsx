import { useSelector } from "react-redux";
import ChartPanel from "../ui/ChartPanel";
import { sumCounts } from "../../lib/format";
import { statusColour } from "../../lib/tokens";
import { useChartPalette } from "../../hooks/useChartPalette";

const ORDER = ["Processing", "Shipped", "Delivered", "Cancelled"];

/**
 * A four-slice pie is the least legible way to show four numbers. A stacked
 * proportion bar plus a labelled breakdown reads faster and needs no legend.
 */
const OrderStatusChart = () => {
  const { orderStatusCounts } = useSelector((state) => state.admin);
  const palette = useChartPalette();

  const total = sumCounts(orderStatusCounts);
  const rows = ORDER.map((status) => {
    const count = Number(orderStatusCounts?.[status] ?? 0);
    return {
      status,
      count,
      percent: total === 0 ? 0 : (count / total) * 100,
      colour: statusColour(status, palette),
    };
  });

  return (
    <ChartPanel
      title="Order status"
      description={`${total} orders in total`}
      isEmpty={total === 0}
      emptyLabel="No orders yet"
    >
      <div
        className="flex h-2 w-full overflow-hidden"
        role="img"
        aria-label={rows
          .map((row) => `${row.status}: ${row.count}`)
          .join(", ")}
      >
        {rows
          .filter((row) => row.count > 0)
          .map((row) => (
            <span
              key={row.status}
              style={{ width: `${row.percent}%`, backgroundColor: row.colour }}
            />
          ))}
      </div>

      <dl className="mt-7 space-y-3">
        {rows.map((row) => (
          <div
            key={row.status}
            className="flex items-center justify-between border-b border-line pb-3 last:border-b-0 last:pb-0"
          >
            <dt className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: row.colour }}
              />
              <span className="text-xs text-muted">{row.status}</span>
            </dt>
            <dd className="tnum text-xs text-ink">
              {row.count}
              <span className="ml-2 text-muted">
                {row.percent.toFixed(0)}%
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </ChartPanel>
  );
};

export default OrderStatusChart;
