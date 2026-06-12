"use client";

import {
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from "@radix-ui/react-popover";
import { LayoutDashboard, LogOut, Package, User } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export interface UserData {
  avatar: string;
  email: string;
  name: string;
}

export interface AccountMenuItem {
  href?: string;
  label: string;
  onClick?: () => void | Promise<void>;
  type?: "dashboard" | "logout" | "orders" | "profile";
}

export interface UserAccountAvatarProps {
  className?: string;
  menuItems?: AccountMenuItem[];
  user: UserData;
}

const menuIcon = {
  dashboard: LayoutDashboard,
  logout: LogOut,
  orders: Package,
  profile: User,
};

export default function UserAccountAvatar({
  user,
  menuItems = [],
  className = "",
}: UserAccountAvatarProps) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const fallbackItems: AccountMenuItem[] = [
    { label: "Profile", type: "profile" },
    { label: "Orders", type: "orders" },
    { label: "Logout", type: "logout" },
  ];
  const accountItems = menuItems.length > 0 ? menuItems : fallbackItems;

  const renderItem = (item: AccountMenuItem) => {
    const Icon = menuIcon[item.type ?? "profile"];
    const className = `flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left font-medium text-sm transition-colors hover:bg-muted ${
      item.type === "logout" ? "text-destructive" : "text-foreground"
    }`;
    const content = (
      <>
        <Icon className="shrink-0" size={16} />
        {item.label}
      </>
    );

    if (item.href) {
      return (
        <Link
          className={className}
          href={item.href}
          key={`${item.label}-${item.href}`}
          onClick={() => setOpen(false)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        className={className}
        key={item.label}
        onClick={() => {
          setOpen(false);
          void item.onClick?.();
        }}
        type="button"
      >
        {content}
      </button>
    );
  };

  return (
    <PopoverRoot onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          aria-label="Open account menu"
          className={`flex cursor-pointer items-center gap-2 rounded-full border bg-background ${className}`}
          type="button"
        >
          <img
            alt={`${user.name || user.email} avatar`}
            className="rounded-full object-cover"
            height={48}
            src={user.avatar}
            width={48}
          />
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          align="end"
          className="z-50 w-64 overflow-hidden rounded-xl border bg-background shadow-xl"
          onOpenAutoFocus={(event) => event.preventDefault()}
          sideOffset={8}
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring" as const, duration: 0.25, bounce: 0 }
            }
          >
            <div className="border-b border-border px-4 py-3">
              <p className="truncate font-semibold text-foreground text-sm">
                {user.name || "Account"}
              </p>
              <p className="truncate text-muted-foreground text-xs">
                {user.email}
              </p>
            </div>
            <div className="flex flex-col p-1">{accountItems.map(renderItem)}</div>
          </motion.div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
}
