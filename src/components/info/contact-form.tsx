"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { validateEmail, validateMessage, validateName } from "@/lib/validation";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", order: "", message: "" });
  const [attempted, setAttempted] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (key: keyof typeof form) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const errors = { name: validateName(form.name), email: validateEmail(form.email), message: validateMessage(form.message) };
  const show = (key: keyof typeof errors) => (attempted ? errors[key] : null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (Object.values(errors).some(Boolean)) return;
    // A real back end would send this to support (email or ticket system). For now it only confirms.
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="rounded-none border border-[#bbf7d0] bg-[#f0fdf4] p-5">
        <p className="t-16 t-w-700 text-[#166534]">Demo form complete</p>
        <p className="mt-1 t-body text-[#166534]">Thanks, {form.name.split(" ")[0]}. Your message is ready, but it has not been sent.</p>
        <p className="mt-2 t-caption text-[#4b5563]">This demo does not submit messages to a support team.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-none border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
      <h2 className="t-title-section t-w-700 text-[#111827]">Send us a message</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="name" label="Full name" autoComplete="name" placeholder="Ada Obi" value={form.name} onChange={set("name")} error={show("name")} />
        <FormField id="email" label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={show("email")} />
      </div>
      <FormField id="order" label="Order number" placeholder="GS-10482" required={false} autoComplete="off" value={form.order} onChange={set("order")} />
      <FormField id="message" label="Message" multiline rows={5} placeholder="How can we help?" value={form.message} onChange={set("message")} error={show("message")} />
      <button type="submit" className="min-h-12 bg-[#087f8c] px-6 t-body t-w-700 text-white transition hover:bg-[#0b6e78]">Send message</button>
    </form>
  );
}
