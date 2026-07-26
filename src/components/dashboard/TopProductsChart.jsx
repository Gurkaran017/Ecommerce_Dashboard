import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartPanel from "../ui/ChartPanel";
import { useChartPalette } from "../../hooks/useChartPalette";

const truncate = (value = "", max = 22) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

/**
 * The previous chart used product *images* as Y-axis tick labels, which is
 * unreadable and collides whenever two products share a photo. Names on the
 * axis, image in the tooltip.
 */
const TopProductsChart = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);
  const palette = useChartPalette();

  const data = (topSellingProducts ?? []).slice(0, 5).map((product) => ({
    ...product,
    label: truncate(product.name),
    total_sold: Number(product.total_sold) || 0,
  }));

  const renderTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const product = payload[0].payload;
    return (
      <div className="flex items-center gap-3 border border-line bg-surface p-2 shadow-portal">
        {product.image && (
          <img
            src={product.image}
            alt=""
            className="h-10 w-10 shrink-0 object-cover"
          />
        )}
        <div>
          <p className="text-xs text-ink">{product.name}</p>
          <p className="tnum text-xs text-muted">{product.total_sold} sold</p>
        </div>
      </div>
    );
  };

  return (
    <ChartPanel
      title="Top products"
      description="Units sold, best five"
      isEmpty={data.length === 0}
      emptyLabel="No sales data yet"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
          barSize={14}
        >
          <CartesianGrid stroke={palette.line} horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={{ stroke: palette.line }} />
          <YAxis
            type="category"
            dataKey="label"
            width={150}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip cursor={{ fill: palette.plate }} content={renderTooltip} />
          <Bar dataKey="total_sold" isAnimationActive={false}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={index === 0 ? palette.accent : palette.ink}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
};

export default TopProductsChart;
