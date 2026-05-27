import { SidebarComponent } from "@/components/dashboard/sidebar";
import React from "react";

async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen">
      <SidebarComponent>{children}</SidebarComponent>
    </div>
  );
}

export default DashboardLayout;
