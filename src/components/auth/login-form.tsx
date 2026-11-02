"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/components/auth/auth-context";
import { FormField } from "@/components/ui/form-field";
import { validateEmail } from "@/lib/validation";

export function LoginForm({ next }: { next: string }) {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const emailError = attempted ? validateEmail(email) : null;
  const passwordError = attempted && !password ? "Password is required." : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    setFormError(null);
    if (validateEmail(email) || !password) return;
    setBusy(true);
    const result = await signIn(email, password);
    setBusy(false);
    if (result.ok) router.push(next);
    else setFormError(result.error);
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Welcome back. Sign in to see your orders and saved items."
      footer={<>New to General-Store? <Link href={`/register?next=${encodeURIComponent(next)}`} className="t-w-700 text-[#087f8c]">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField id="email" label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={setEmail} error={emailError} />
        <div>
          <FormField id="password" label="Password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Your password" value={password} onChange={setPassword} error={passwordError} />
          <div className="mt-2 flex items-center justify-between t-caption">
            <label className="flex cursor-pointer items-center gap-2 text-[#374151]">
              <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="h-4 w-4 accent-[#17b5c9]" /> Show password
            </label>
            <Link href="/info/contact" className="text-[#087f8c] underline">Forgot password?</Link>
          </div>
        </div>
        {formError && <p role="alert" className="t-caption text-[#dc2626]">{formError}</p>}
        <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center rounded-none bg-[#087f8c] t-body t-w-700 text-white transition hover:bg-[#0b6e78] disabled:opacity-70">
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="t-caption text-[#6b7280]">Demo sign-in: any valid email and password works for now.</p>
      </form>
    </AuthCard>
  );
}
