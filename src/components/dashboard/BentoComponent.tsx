"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { dashboardPageClass, dashboardPanelClass } from "./dashboardStyles";
import { useTheme } from "next-themes";
import { ordersApi, productsApi } from "@/lib/api";
import { OrderStatsResponse } from "@/type/order";
import { ProductsResponse } from "@/type/productRes";

type ChartPoint = { name: string; uv: number; pv: number };

const fallbackData: ChartPoint[] = [
  { name: "Jan", uv: 0, pv: 0 },
  { name: "Feb", uv: 0, pv: 0 },
  { name: "Mar", uv: 0, pv: 0 },
  { name: "Apr", uv: 0, pv: 0 },
  { name: "May", uv: 0, pv: 0 },
  { name: "Jun", uv: 0, pv: 0 },
];

const Chart = ({ data }: { data: ChartPoint[] }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "h-40 w-full min-w-0 rounded-md border p-3 sm:h-44",
        "border-slate-200 bg-slate-50 dark:border-white/[0.07] dark:bg-[#04060c]",
      )}
    >
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%" minHeight={160}>
          <LineChart data={data}>
            <CartesianGrid
              stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"}
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: isDark ? "#a1a1aa" : "#64748b", fontSize: 12 }}
              axisLine={{
                stroke: isDark
                  ? "rgba(255,255,255,0.16)"
                  : "rgba(15,23,42,0.16)",
              }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: isDark ? "#05070d" : "#ffffff",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.12)"
                  : "1px solid rgba(15,23,42,0.12)",
                borderRadius: 8,
                color: isDark ? "#fff" : "#0f172a",
              }}
            />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="#fe1929"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full w-full animate-pulse rounded bg-slate-200/60 dark:bg-white/5" />
      )}
    </div>
  );
};

function BentoComponent() {
  const [chartData, setChartData] = useState<ChartPoint[]>(fallbackData);
  const [productTotal, setProductTotal] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadDashboardData() {
      try {
        const [statsRes, productsRes] = await Promise.all([
          ordersApi.stats() as Promise<OrderStatsResponse>,
          productsApi.list({ page: 1, limit: 1 }) as Promise<ProductsResponse>,
        ]);

        if (ignore) return;

        setProductTotal(productsRes.total ?? productsRes.count ?? 0);

        const stats = statsRes.data;
        if (stats?.monthlySales?.length) {
          setChartData(stats.monthlySales);
        }
        if (stats?.totalOrders !== undefined) {
          setOrderTotal(stats.totalOrders);
        }
        if (stats?.totalRevenue !== undefined) {
          setRevenue(stats.totalRevenue);
        }
      } catch (err) {
        console.error("Dashboard stats error", err);
      }
    }

    void loadDashboardData();

    return () => {
      ignore = true;
    };
  }, []);

  const features = useMemo(
    () => [
      {
        title: "Sales Analytics",
        description: `Monthly sales overview. Total revenue: $${revenue.toFixed(2)}.`,
        header: <Chart data={chartData} />,
        className: "md:col-span-2",
      },
      {
        title: "Product Catalog",
        description: `${productTotal} products listed in the store.`,
        header: <Chart data={chartData} />,
      },
      {
        title: "Order Volume",
        description: `${orderTotal} orders tracked in the system.`,
        header: <Chart data={chartData} />,
      },
      {
        title: "Performance Metrics",
        description: "Live metrics from your backend dashboard.",
        header: <Chart data={chartData} />,
        className: "md:col-span-2",
      },
    ],
    [chartData, orderTotal, productTotal, revenue],
  );

  return (
    <div className={dashboardPageClass()}>
      <BentoGrid className={cn("max-w-6xl md:auto-rows-[20rem]")}>
        {features.map(({ className, ...feature }, i) => (
          <motion.div
            key={i}
            className={cn(className)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <BentoGridItem
              className={dashboardPanelClass("h-full")}
              {...feature}
            />
          </motion.div>
        ))}
      </BentoGrid>
    </div>
  );
}

export default BentoComponent;
