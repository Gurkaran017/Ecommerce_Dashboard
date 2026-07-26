import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown } from "lucide-react";

import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import Skeleton from "../components/ui/Skeleton";
import StatusDot from "../components/ui/StatusDot";
import { cn } from "../lib/cn";
import { formatDateTime, formatPrice } from "../lib/format";
import {
  deleteOrder,
  fetchAllOrders,
  updateOrderStatus,
} from "../store/slices/orderSlice";

const STATUSES = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAGE_SIZE = 25;

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const counts = useMemo(() => {
    const tally = { All: orders.length };
    orders.forEach((order) => {
      tally[order.order_status] = (tally[order.order_status] ?? 0) + 1;
    });
    return tally;
  }, [orders]);

  const filtered = useMemo(
    () =>
      statusFilter === "All"
        ? orders
        : orders.filter((order) => order.order_status === statusFilter),
    [orders, statusFilter]
  );

  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        lead="Every order placed on the storefront, newest first."
      />

      <nav aria-label="Filter orders by status">
        <ul className="flex flex-wrap gap-6">
          {STATUSES.map((status) => (
            <li key={status}>
              <button
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={cn(
                  "meta transition-colors ease-editorial hover:text-ink",
                  statusFilter === status &&
                    "text-ink underline decoration-1 underline-offset-4"
                )}
              >
                {status}
                <span className="tnum ml-1.5">{counts[status] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {error && !loading && <p className="text-sm text-danger">{error}</p>}

      {loading ? (
        <div className="space-y-px border-t border-line">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={statusFilter === "All" ? "No orders yet" : `No ${statusFilter} orders`}
          body={
            statusFilter === "All"
              ? "Orders will appear here as customers check out."
              : "Try another status."
          }
        />
      ) : (
        <>
          <div className="border-t border-line">
            <div className="meta grid grid-cols-[6rem_1fr_1fr_5rem_7rem_2rem] gap-4 border-b border-line py-3">
              <span>Order</span>
              <span>Placed</span>
              <span>Customer</span>
              <span className="text-right">Items</span>
              <span className="text-right">Total</span>
              <span />
            </div>

            {pageRows.map((order) => {
              const expanded = expandedId === order.id;
              const itemCount =
                order.order_items?.reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0
                ) ?? 0;

              return (
                <article key={order.id} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                    aria-expanded={expanded}
                    className="grid w-full grid-cols-[6rem_1fr_1fr_5rem_7rem_2rem] items-center gap-4 py-4 text-left text-[0.8125rem] transition-colors ease-editorial hover:bg-plate"
                  >
                    <span className="tnum">#{order.id}</span>
                    <span className="tnum truncate text-muted">
                      {formatDateTime(order.created_at)}
                    </span>
                    <span className="truncate">
                      {order.shipping_info?.full_name ?? "—"}
                    </span>
                    <span className="tnum text-right text-muted">{itemCount}</span>
                    <span className="tnum text-right">
                      {formatPrice(order.total_price)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 justify-self-end text-muted transition-transform ease-editorial",
                        expanded && "rotate-180"
                      )}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </button>

                  {expanded && (
                    <div className="grid gap-8 pb-8 lg:grid-cols-[18rem_1fr]">
                      <div>
                        <p className="meta mb-3">Status</p>
                        <label className="sr-only" htmlFor={`status-${order.id}`}>
                          Order status
                        </label>
                        <select
                          id={`status-${order.id}`}
                          value={order.order_status}
                          onChange={(event) =>
                            dispatch(
                              updateOrderStatus({
                                orderId: order.id,
                                status: event.target.value,
                              })
                            )
                          }
                          className="w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-2 text-[0.8125rem] focus:border-ink focus:outline-none focus:ring-0"
                        >
                          {STATUSES.filter((status) => status !== "All").map(
                            (status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            )
                          )}
                        </select>

                        <p className="meta mb-3 mt-8">Shipping</p>
                        <address className="space-y-1 text-xs not-italic leading-relaxed text-muted">
                          <p className="text-ink">
                            {order.shipping_info?.full_name}
                          </p>
                          <p className="tnum">{order.shipping_info?.phone}</p>
                          <p>
                            {order.shipping_info?.address},{" "}
                            {order.shipping_info?.city}
                          </p>
                          <p>
                            {order.shipping_info?.state}{" "}
                            <span className="tnum">
                              {order.shipping_info?.pincode}
                            </span>
                          </p>
                        </address>

                        <button
                          type="button"
                          onClick={() => setPendingDelete(order)}
                          className="mt-8 text-xs text-muted transition-colors ease-editorial hover:text-danger"
                        >
                          Delete order
                        </button>
                      </div>

                      <div>
                        <p className="meta mb-3">Items</p>
                        <ul>
                          {order.order_items?.map((item) => (
                            <li
                              key={item.order_item_id}
                              className="flex items-center gap-4 border-b border-line py-3 last:border-b-0"
                            >
                              <div className="plate h-10 w-10 shrink-0">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-contain p-1"
                                  />
                                )}
                              </div>
                              <p className="min-w-0 flex-1 truncate text-[0.8125rem]">
                                {item.title}
                              </p>
                              <p className="tnum text-xs text-muted">
                                {item.quantity} &times; {formatPrice(item.price)}
                              </p>
                              <p className="tnum w-24 text-right text-[0.8125rem]">
                                {formatPrice(item.quantity * item.price)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {!expanded && (
                    <div className="pb-4">
                      <StatusDot status={order.order_status} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemLabel="orders"
            onChange={setPage}
          />

          {/* The endpoint returns every order at once, so both the filter and
              the pagination above run in the browser. Say so rather than imply
              server-side paging. */}
          <p className="text-xs text-muted">
            Filtering and paging happen in the browser — the orders endpoint
            returns the full set.
          </p>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          dispatch(deleteOrder(pendingDelete.id));
          setPendingDelete(null);
        }}
        loading={loading}
        title="Delete order"
        body={`Order #${pendingDelete?.id} will be permanently removed. This cannot be undone.`}
      />
    </div>
  );
};

export default Orders;
