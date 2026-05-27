import { AuthComponent } from "@/components/auth/AuthComponent";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}
export default async function AuthPage({ searchParams }: PageProps) {
  const { status: queryStatus } = await searchParams;
  const currentStatus = queryStatus === "login" ? queryStatus : null;
  if (!currentStatus) {
    redirect("/Login?status=login");
  }

  // اگر وضعیت معتبر است، فرم مناسب را رندر کن
  const showLogin = currentStatus === "login";

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <AuthComponent login={showLogin} mode="admin" />
      </div>
    </div>
  );
}
