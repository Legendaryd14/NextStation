"use client";

import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { LoginFormData } from "@/type/Auth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export default function LoginForm({
  onSubmit,
  isSubmitting = false,
  submitError,
}: LoginFormProps) {
  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={loginForm.handleSubmit(onSubmit)}
      className="space-y-5 md:space-y-6"
    >
      {/* Email */}
      <div>
        <Label
          htmlFor="email"
          error={!!loginForm.formState.errors.email}
          className="block text-sm text-zinc-400 mb-2"
        >
          Email
        </Label>

        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

          <Input
            id="email"
            type="email"
            {...loginForm.register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={loginForm.formState.errors.email?.message}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 md:py-4 text-sm md:text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300/40 transition-all"
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <Label
          htmlFor="password"
          error={!!loginForm.formState.errors.password}
          className="block text-sm text-zinc-400 mb-2"
        >
          Password
        </Label>

        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

          <Input
            id="password"
            type="password"
            {...loginForm.register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={loginForm.formState.errors.password?.message}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 md:py-4 text-sm md:text-base text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-300 focus:ring-1 focus:ring-amber-300/40 transition-all"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-zinc-400 hover:text-amber-300 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {submitError ? (
        <p className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 py-3.5 md:py-4 rounded-xl bg-amber-300 hover:bg-amber-200 text-zinc-950 font-semibold text-sm md:text-base transition-all shadow-[0_6px_20px_rgba(252,211,77,0.25)] hover:shadow-[0_10px_28px_rgba(252,211,77,0.35)] disabled:opacity-60"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
