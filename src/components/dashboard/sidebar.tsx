"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export function SidebarComponent({ children }: { children: React.ReactNode }) {
  const iconClassName = cn(
    "h-5 w-5 shrink-0 text-slate-600 dark:text-zinc-300",
  );
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className={iconClassName} />,
    },
    {
      label: "Orders",
      href: "/dashboard/orders",
      icon: <IconUserBolt className={iconClassName} />,
    },
    {
      label: "Products",
      href: "/dashboard/products",
      icon: <IconSettings className={iconClassName} />,
    },
    {
      label: "stocks",
      href: "/dashboard/stock",
      icon: <IconArrowLeft className={iconClassName} />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex h-screen w-screen flex-1 flex-col overflow-hidden rounded-md",
        "border border-slate-200 bg-slate-100 md:flex-row",
        "dark:border-black dark:bg-[#020308]",
        // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody
          className={cn(
            "justify-between gap-10 border-r border-slate-200 bg-white",
            "text-slate-800 shadow-2xl shadow-slate-200/60",
            "dark:border-white/[0.07] dark:bg-[#03050a] dark:text-zinc-200 dark:shadow-black/60",
          )}
        >
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <AnimatedThemeToggler />
            <SidebarLink
              link={{
                label: "NextStation",
                href: "/",
                icon: (
                  <Image
                    src="/images/NextStationLogo.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Logo"
                    priority
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className={cn("flex min-w-0 flex-1 overflow-hidden")}>
        {children}
      </main>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className={cn(
        "relative z-20 flex items-center space-x-2 py-1",
        "text-sm font-normal text-slate-950 dark:text-white",
      )}
    >
      <div
        className={cn(
          "h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm",
          "rounded-br-lg rounded-bl-sm bg-[#fe1929]",
        )}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-slate-950 dark:text-white"
      >
        NextStation
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className={cn(
        "relative z-20 flex items-center space-x-2 py-1",
        "text-sm font-normal text-slate-950 dark:text-white",
      )}
    >
      <Image
        src="/images/NextStationLogo.png"
        className="h-7 w-7 shrink-0 rounded-full"
        width={50}
        height={50}
        alt="Logo"
        priority
      />
    </a>
  );
};
