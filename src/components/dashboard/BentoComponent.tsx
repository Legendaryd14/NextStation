"use client";

import React from "react";
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
import {
  dashboardPageClass,
  dashboardPanelClass,
} from "./dashboardStyles";
import { useTheme } from "next-themes";

const data = [
  { name: "Jan", uv: 400, pv: 240 },
  { name: "Feb", uv: 300, pv: 139 },
  { name: "Mar", uv: 200, pv: 980 },
  { name: "Apr", uv: 278, pv: 390 },
  { name: "May", uv: 189, pv: 480 },
  { name: "Jun", uv: 239, pv: 380 },
];

const Chart = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "h-40 w-full min-w-0 rounded-md border p-3 sm:h-44",
        "border-slate-200 bg-slate-50 dark:border-white/[0.07] dark:bg-[#04060c]",
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
};

const features = [
  {
    title: "Sales Analytics",
    description: "Track monthly sales performance and revenue growth.",
    header: <Chart />,
    className: "md:col-span-2",
  },
  {
    title: "Customer Growth",
    description: "Monitor how your customer base increases over time.",
    header: <Chart />,
  },
  {
    title: "Revenue Insights",
    description: "Analyze where your revenue comes from.",
    header: <Chart />,
  },
  {
    title: "Performance Metrics",
    description: "Important KPIs that reflect business health.",
    header: <Chart />,
    className: "md:col-span-2",
  },
];

function BentoComponent() {
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
