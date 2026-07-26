import { useSelector } from "react-redux";
import MonthlySalesChart from "../components/dashboard/MonthlySalesChart";
import OrderStatusChart from "../components/dashboard/OrderStatusChart";
import SummaryList from "../components/dashboard/SummaryList";
import TopProductsChart from "../components/dashboard/TopProductsChart";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import StatTile from "../components/ui/StatTile";
import { formatCompactPrice, revenueDelta } from "../lib/format";

const Overview = () => {
  const {
    todayRevenue,
    yesterdayRevenue,
    totalRevenueAllTime,
    totalUsersCount,
    lowStockProducts,
    topSellingProducts,
  } = useSelector((state) => state.admin);

  const delta = revenueDelta(todayRevenue, yesterdayRevenue);

  const columns = [
    {
      key: "image",
      header: "",
      width: "3.5rem",
      cell: (row) => (
        <div className="plate h-10 w-10">
          <img
            src={row.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-1"
          />
        </div>
      ),
    },
    { key: "name", header: "Product", cell: (row) => row.name },
    {
      key: "category",
      header: "Category",
      cell: (row) => <span className="text-muted">{row.category}</span>,
    },
    {
      key: "sold",
      header: "Sold",
      align: "right",
      cell: (row) => <span className="tnum">{row.total_sold}</span>,
    },
    {
      key: "ratings",
      header: "Rating",
      align: "right",
      cell: (row) => <span className="tnum">{Number(row.ratings).toFixed(1)}</span>,
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader title="Overview" lead="Sales, orders and stock at a glance." />

      <section className="grid divide-y divide-line border-b border-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        <StatTile
          label="Today's revenue"
          value={formatCompactPrice(todayRevenue)}
          delta={delta}
        />
        <StatTile
          label="All-time revenue"
          value={formatCompactPrice(totalRevenueAllTime)}
        />
        <StatTile label="Total users" value={totalUsersCount ?? 0} />
        <StatTile label="Low stock" value={lowStockProducts ?? 0} />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <MonthlySalesChart />
        <OrderStatusChart />
        <TopProductsChart />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="border border-line p-5">
            <h2 className="meta-ink">Top products</h2>
            <p className="mt-1 text-xs text-muted">Products with the most sales</p>
            <div className="mt-5">
              <DataTable
                caption="Top selling products"
                columns={columns}
                rows={topSellingProducts ?? []}
                rowKey={(row) => row.name}
              />
            </div>
          </div>
        </div>

        <SummaryList />
      </section>
    </div>
  );
};

export default Overview;
