"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardOrder, OrderStatus, mapBackendOrder } from "@/type/order";
import {
  dashboardMutedTextClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTitleClass,
} from "./dashboardStyles";
import { useOrdersApi } from "@/hooks/useOrdersApi";

export default function OrdersPage() {
  const { getAllOrders } = useOrdersApi();
  const listRef = useRef(getAllOrders);

  useEffect(() => {
    listRef.current = getAllOrders;
  }, [getAllOrders]);

  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const res = await listRef.current({
          page: 1,
          limit: 10,
        });

        console.log("ORDERS RESPONSE");
        console.log(JSON.stringify(res, null, 2));
        if (ignore) return;

        if (res.ok && res.data?.data) {
          setOrders(res.data.data.map(mapBackendOrder));
        } else {
          setOrders([]);
          setError(
            res.data?.message ||
              "Unable to load orders. Admin access required.",
          );
        }
      } catch (err) {
        console.error("Fetch orders error", err);

        if (ignore) return;

        setError("Unable to load orders. Admin access required.");
        setOrders([]);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchOrders();

    return () => {
      ignore = true;
    };
  }, []);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
      case "shipped":
        return <Package className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-orange-500/10 text-orange-400";
      case "processing":
        return "bg-sky-500/10 text-sky-400";
      case "shipped":
        return "bg-violet-500/10 text-violet-400";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400";
      case "cancelled":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-slate-500/10 text-slate-300";
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  ).length;

  return (
    <div className={dashboardPageClass()}>
      <div className="mb-8">
        <h2 className={dashboardTitleClass("text-primary")}>
          Order Management
        </h2>
        <p className={dashboardMutedTextClass("mt-1")}>View customer orders</p>
        <div className="mt-2 h-0.5 w-24 bg-primary" />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className={dashboardPanelClass()}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={dashboardTableHeadClass()}>
                <th className="px-6 py-4 text-left text-sm uppercase tracking-wider text-muted-foreground">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase tracking-wider text-muted-foreground">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase tracking-wider text-muted-foreground">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase tracking-wider text-muted-foreground">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className={dashboardTableRowClass()}>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-accent">
                        {order.orderNumber}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-foreground">{order.customer}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">
                        {order.product}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-foreground">{order.quantity}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-foreground">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 rounded px-3 py-1 text-sm capitalize",
                          getStatusColor(order.status),
                        )}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">
                        {order.date}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={dashboardPanelClass("p-4")}>
          <p className={dashboardMutedTextClass("text-sm")}>Total Orders</p>
          <p className="mt-1 text-foreground">{orders.length}</p>
        </div>

        <div className={dashboardPanelClass("p-4")}>
          <p className={dashboardMutedTextClass("text-sm")}>Total Revenue</p>
          <p className="mt-1 text-foreground">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className={dashboardPanelClass("p-4")}>
          <p className={dashboardMutedTextClass("text-sm")}>Active Orders</p>
          <p className="mt-1 text-foreground">{activeOrders}</p>
        </div>
      </div>
    </div>
  );
}
