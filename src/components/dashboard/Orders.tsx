"use client";

import { useEffect, useState } from "react";
import { Trash2, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ordersApi } from "@/lib/api";
import { useIsAdmin } from "@/lib/admin";
import {
  DashboardOrder,
  OrdersResponse,
  OrderStatus,
  mapBackendOrder,
} from "@/type/order";
import {
  dashboardMutedTextClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTitleClass,
} from "./dashboardStyles";

export default function OrdersPage() {
  const isAdmin = useIsAdmin();
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchOrders() {
      try {
        const res = (await ordersApi.list()) as OrdersResponse;

        if (ignore) return;

        setError("");
        setOrders((res.data ?? []).map(mapBackendOrder));
      } catch (err) {
        console.error("Fetch orders error", err);
        if (ignore) return;
        setError("Unable to load orders. Admin access required.");
        setOrders([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void fetchOrders();

    return () => {
      ignore = true;
    };
  }, []);

  const deleteOrder = async (orderId: string) => {
    if (!isAdmin) return;

    try {
      await ordersApi.delete(orderId);
      setOrders((current) => current.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Delete order error", err);
      setError("Failed to delete order.");
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Processing":
      case "Shipped":
        return <Package className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-[#ff6600]/10 text-[#ff6600]";
      case "Processing":
        return "bg-accent/10 text-accent";
      case "Shipped":
        return "bg-[#b400ff]/10 text-[#b400ff]";
      case "Delivered":
        return "bg-[#00ff88]/10 text-[#00ff88]";
      case "Cancelled":
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className={dashboardPageClass()}>
      <div className="mb-8">
        <h2 className={dashboardTitleClass("text-primary")}>
          Order Management
        </h2>
        <p className={dashboardMutedTextClass("mt-1")}>
          View and manage customer orders
        </p>
        <div className="mt-2 h-0.5 w-24 bg-primary"></div>
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
                <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 8 : 7}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className={dashboardTableRowClass()}>
                    <td className="px-6 py-4">
                      <span className="text-accent font-mono text-sm">
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
                          "inline-flex items-center gap-2 rounded px-3 py-1 text-sm",
                          getStatusColor(order.status),
                        )}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{order.date}</span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-2 rounded bg-destructive hover:bg-destructive/80 text-destructive-foreground transition-colors group"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && orders.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className={dashboardMutedTextClass()}>No orders found</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={dashboardPanelClass("p-4")}>
          <p className={dashboardMutedTextClass("text-sm")}>Total Orders</p>
          <p className="text-foreground mt-1">{orders.length}</p>
        </div>
        <div className={dashboardPanelClass("p-4")}>
          <p className={dashboardMutedTextClass("text-sm")}>Total Revenue</p>
          <p className="text-foreground mt-1">
            ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
          </p>
        </div>
        <div className={dashboardPanelClass("p-4")}>
          <p className={dashboardMutedTextClass("text-sm")}>Active Orders</p>
          <p className="text-foreground mt-1">
            {
              orders.filter(
                (o) => o.status !== "Delivered" && o.status !== "Cancelled",
              ).length
            }
          </p>
        </div>
      </div>
    </div>
  );
}
