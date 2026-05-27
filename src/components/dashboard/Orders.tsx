"use client";

import { useState } from "react";
import { Trash2, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  dashboardMutedTextClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTitleClass,
} from "./dashboardStyles";

interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  product: string;
  quantity: number;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

const initialOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2024-001",
    customer: "John Davis",
    product: "",
    quantity: 2,
    total: 159.98,
    status: "Delivered",
    date: "2024-05-01",
  },
  {
    id: 2,
    orderNumber: "ORD-2024-002",
    customer: "Emily Wilson",
    product: "",
    quantity: 1,
    total: 149.99,
    status: "Shipped",
    date: "2024-05-03",
  },
  {
    id: 3,
    orderNumber: "ORD-2024-003",
    customer: "Michael Brown",
    product: "",
    quantity: 3,
    total: 299.97,
    status: "Processing",
    date: "2024-05-04",
  },
  {
    id: 4,
    orderNumber: "ORD-2024-004",
    customer: "Jessica Taylor",
    product: "",
    quantity: 1,
    total: 399.99,
    status: "Pending",
    date: "2024-05-05",
  },
  {
    id: 5,
    orderNumber: "ORD-2024-005",
    customer: "David Martinez",
    product: "",
    quantity: 5,
    total: 149.95,
    status: "Delivered",
    date: "2024-05-06",
  },
  {
    id: 6,
    orderNumber: "ORD-2024-006",
    customer: "Sarah Johnson",
    product: "",
    quantity: 1,
    total: 79.99,
    status: "Cancelled",
    date: "2024-05-07",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const deleteOrder = (orderId: number) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  const getStatusIcon = (status: Order["status"]) => {
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

  const getStatusColor = (status: Order["status"]) => {
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
                <th className="px-6 py-4 text-left text-sm text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={dashboardTableRowClass()}
                >
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
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="p-2 rounded bg-destructive hover:bg-destructive/80 text-destructive-foreground transition-colors group"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
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
