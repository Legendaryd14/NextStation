// components/auth/SignupForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import { SignupFormData } from "@/type/Auth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const signupForm = useForm<SignupFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <Label
          htmlFor="name"
          error={!!signupForm.formState.errors.name}
          className="block text-sm text-zinc-400 mb-2"
        >
          Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            id="name"
            type="text"
            {...signupForm.register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
            error={signupForm.formState.errors.name?.message}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
            placeholder="Choose a Name"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <Label
          htmlFor="email"
          error={!!signupForm.formState.errors.email}
          className="block text-sm text-zinc-400 mb-2"
        >
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            id="email"
            type="email"
            {...signupForm.register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={signupForm.formState.errors.email?.message}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <Label
          htmlFor="password"
          error={!!signupForm.formState.errors.password}
          className="block text-sm text-zinc-400 mb-2"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            id="password"
            type="password"
            {...signupForm.register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            error={signupForm.formState.errors.password?.message}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-600 transition-colors"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#fe1929] hover:bg-[#a91620] text-white py-3 rounded-lg font-medium transition-colors mt-6"
      >
        Create Account
      </button>
    </form>
  );
}
