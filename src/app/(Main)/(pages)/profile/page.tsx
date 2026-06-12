"use client";

import { useAuth } from "@/components/auth/context/AuthProvider.tsx";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-28 text-white">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Account
        </p>
        <h1 className="mt-3 text-3xl font-bold">Profile</h1>
        {loading ? (
          <p className="mt-6 text-neutral-300">Loading profile...</p>
        ) : user ? (
          <div className="mt-6 grid gap-4 text-neutral-200">
            <div>
              <p className="text-sm text-neutral-400">Name</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-neutral-300">Please login to view your profile.</p>
        )}
      </section>
    </main>
  );
}
