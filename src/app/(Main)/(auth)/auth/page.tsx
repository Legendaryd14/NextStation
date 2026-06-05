import { AuthComponent } from "@/components/auth/AuthComponent";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ status?: string; redirect?: string }>;
}
export default async function AuthPage({ searchParams }: PageProps) {
  const { status: queryStatus, redirect: redirectTo } = await searchParams;
  const currentStatus =
    queryStatus === "login" || queryStatus === "signup" ? queryStatus : null;
  if (!currentStatus) {
    const params = new URLSearchParams({ status: "login" });
    if (redirectTo) {
      params.set("redirect", redirectTo);
    }
    redirect(`/auth?${params.toString()}`);
  }

  // اگر وضعیت معتبر است، فرم مناسب را رندر کن
  const showLogin = currentStatus === "login";

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <AuthComponent login={showLogin} mode="customer" redirectTo={redirectTo} />
      </div>
    </div>
  );
}
