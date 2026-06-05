import { AuthComponent } from "@/components/auth/AuthComponent";

interface PageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { redirect: redirectTo } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <AuthComponent login mode="admin" redirectTo={redirectTo} />
      </div>
    </div>
  );
}
