"use client";

import { useAuth } from "@/components/auth/context/AuthProvider.tsx";
import {
  dashboardMutedTextClass,
  dashboardPageClass,
  dashboardPanelClass,
  dashboardTitleClass,
} from "@/components/dashboard/dashboardStyles";

export default function AdminProfilePage() {
  const { user, loading } = useAuth();

  return (
    <div className={dashboardPageClass()}>
      <div className="mb-8">
        <h2 className={dashboardTitleClass("text-primary")}>Admin Profile</h2>
        <p className={dashboardMutedTextClass("mt-1")}>Manage your admin account</p>
        <div className="mt-2 h-0.5 w-24 bg-primary" />
      </div>

      <div className={dashboardPanelClass("p-6")}>
        {loading ? (
          <p className={dashboardMutedTextClass()}>Loading profile...</p>
        ) : user ? (
          <div className="grid gap-4">
            <div>
              <p className={dashboardMutedTextClass("text-sm")}>Name</p>
              <p className="text-lg font-semibold text-foreground">{user.name}</p>
            </div>
            <div>
              <p className={dashboardMutedTextClass("text-sm")}>Email</p>
              <p className="text-lg font-semibold text-foreground">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className={dashboardMutedTextClass()}>Please login to view your profile.</p>
        )}
      </div>
    </div>
  );
}
