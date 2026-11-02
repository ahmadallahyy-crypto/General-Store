"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/components/auth/auth-context";
import { FormField } from "@/components/ui/form-field";
import { validateEmail, validateName, validatePassword, validatePhone } from "@/lib/validation";

export function RegisterForm({ next }: { next: string }) {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof form) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const errors = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    phone: form.phone.trim() ? validatePhone(form.phone) : null, // optional, but checked if filled in
    password: validatePassword(form.password),
    confirm: form.confirm === form.password ? null : "Passwords do not match.",
  };
  const show = (key: keyof typeof errors) => (attempted ? errors[key] : null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    setFormError(null);
    if (Object.values(errors).some(Boolean) || !agreed) return;
    setBusy(true);
    const result = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
    setBusy(false);
    if (result.ok) router.push(next);
    else setFormError(result.error);
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Track orders, save items and check out faster."
      footer={<>Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`} className="t-w-700 text-[#087f8c]">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField id="name" label="Full name" autoComplete="name" placeholder="Ada Obi" value={form.name} onChange={set("name")} error={show("name")} />
        <FormField id="email" label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={show("email")} />
        <FormField id="phone" label="Phone number" type="tel" inputMode="tel" autoComplete="tel" placeholder="0801 234 5678" required={false} value={form.phone} onChange={set("phone")} error={show("phone")} />
        <FormField id="password" label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={set("password")} error={show("password")} />
        <FormField id="confirm" label="Confirm password" type="password" autoComplete="new-password" placeholder="Repeat your password" value={form.confirm} onChange={set("confirm")} error={show("confirm")} />
        <div>
          <label className="flex cursor-pointer items-start gap-3 t-body text-[#374151]">
            <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 flex-none accent-[#17b5c9]" />
            <span>I agree to the <Link href="/info/terms" className="text-[#087f8c] underline">Terms of Service</Link> and <Link href="/info/privacy" className="text-[#087f8c] underline">Privacy Policy</Link>.</span>
          </label>
          {attempted && !agreed && <p role="alert" className="mt-1 t-caption text-[#dc2626]">Please accept the terms to continue.</p>}
        </div>
        {formError && <p role="alert" className="t-caption text-[#dc2626]">{formError}</p>}
        <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center rounded-none bg-[#087f8c] t-body t-w-700 text-white transition hover:bg-[#0b6e78] disabled:opacity-70">
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
