import { useSelector } from "react-redux";
import { formatPrice, sumCounts } from "../../lib/format";

/** Six metrics as a hairline definition list. No coloured icon per row. */
const SummaryList = () => {
  const {
    topSellingProducts,
    lowStockProducts,
    revenueGrowth,
    newUsersThisMonth,
    currentMonthSales,
    orderStatusCounts,
  } = useSelector((state) => state.admin);

  const best = topSellingProducts?.[0];

  const rows = [
    {
      label: "Sales this month",
      value: formatPrice(currentMonthSales),
    },
    {
      /* sumCounts coerces — the raw values are strings, and a plain reduce
         concatenated them into "02121". */
      label: "Orders placed",
      value: sumCounts(orderStatusCounts),
    },
    {
      label: "Best seller",
      value: best ? `${best.name} · ${best.total_sold} sold` : "—",
    },
    {
      label: "Low stock",
      value: `${lowStockProducts ?? 0} products`,
    },
    {
      /* revenueGrowth arrives pre-formatted, e.g. "+12.4%". Never compute on it. */
      label: "Revenue growth",
      value: revenueGrowth || "—",
    },
    {
      label: "New customers",
      value: newUsersThisMonth ?? 0,
    },
  ];

  return (
    <section className="border border-line p-5">
      <h2 className="meta-ink">Summary</h2>
      <p className="mt-1 text-xs text-muted">Key metrics for the current month</p>

      <dl className="mt-5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0 last:pb-0"
          >
            <dt className="shrink-0 text-xs text-muted">{row.label}</dt>
            <dd className="tnum truncate text-right text-[0.8125rem] text-ink">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default SummaryList;
