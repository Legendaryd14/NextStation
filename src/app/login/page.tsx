import { AuthComponent } from "@/components/auth/AuthComponent";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <AuthComponent login mode="admin" />
      </div>
    </div>
  );
}
