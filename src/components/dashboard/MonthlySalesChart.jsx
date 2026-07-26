import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartPanel from "../ui/ChartPanel";
import ChartTooltip from "../ui/ChartTooltip";
import { formatCompactPrice, formatPrice } from "../../lib/format";
import { getLastNMonths } from "../../lib/helper";
import { useChartPalette } from "../../hooks/useChartPalette";

const MonthlySalesChart = () => {
  const { monthlySales } = useSelector((state) => state.admin);
  /* Re-read tokens when the theme flips; Recharts cannot inherit CSS vars. */
  const palette = useChartPalette();

  /* The API returns `totalsales` (lower-case s) and a "MMM yyyy" month label. */
  const data = getLastNMonths(4).map(({ month }) => ({
    month,
    totalSales: Number(
      monthlySales?.find((entry) => entry.month === month)?.totalsales ?? 0
    ),
  }));

  const isEmpty = data.every((entry) => entry.totalSales === 0);

  return (
    <ChartPanel
      title="Monthly sales"
      description="Revenue over the last four months"
      isEmpty={isEmpty}
      emptyLabel="No sales recorded in this window"
    >
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid stroke={palette.line} vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={{ stroke: palette.line }}
          />
          <YAxis
            tickFormatter={formatCompactPrice}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip
            cursor={{ stroke: palette.line }}
            content={
              <ChartTooltip
                format={(row) => (
                  <p className="tnum text-xs text-ink">
                    {formatPrice(row.totalSales)}
                  </p>
                )}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke={palette.ink}
            strokeWidth={1.5}
            dot={{ r: 2, fill: palette.ink, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: palette.accent, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
};

export default MonthlySalesChart;
