"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "@/components/ui/safe-image";
import Link from "next/link";
import { cartLineId, useCart } from "@/components/cart/cart-context";
import { variantLabel } from "@/data/product-variants";
import { FormField } from "@/components/ui/form-field";
import {
  HOME_DELIVERY_ETA,
  PICKUP_ETA,
  RETURN_WINDOW_DAYS,
  deliveryFee,
  formatMoney,
  type DeliveryMethodKey,
} from "@/lib/store-policies";
import { validateAddress, validateCity, validateEmail, validateName, validatePhone, type Validator } from "@/lib/validation";

// ============ FORM FIELD CONFIG ============
type FieldKey = "name" | "email" | "phone" | "address" | "city" | "zip" | "note";

type FieldConfig = {
  key: FieldKey;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  hint?: string;
  half?: boolean;
  required?: boolean;
  multiline?: boolean;
  validate?: Validator;
};

const FIELDS: FieldConfig[] = [
  { key: "name", label: "Full name", placeholder: "Ada Obi", autoComplete: "name", validate: validateName },
  { key: "email", label: "Email", placeholder: "ada@example.com", type: "email", inputMode: "email", autoComplete: "email", validate: validateEmail },
  { key: "phone", label: "Phone number", placeholder: "0801 234 5678", type: "tel", inputMode: "tel", autoComplete: "tel", validate: validatePhone, hint: "The courier calls this number on delivery." },
  { key: "address", label: "Address", placeholder: "12 Market Street", autoComplete: "street-address", validate: validateAddress },
  { key: "city", label: "City", placeholder: "Abuja", autoComplete: "address-level2", half: true, validate: validateCity },
  { key: "zip", label: "Postal code", placeholder: "900001", autoComplete: "postal-code", half: true, required: false },
  { key: "note", label: "Delivery note", placeholder: "Gate code, landmark, best time to call…", autoComplete: "off", required: false, multiline: true },
];

const EMPTY_FORM: Record<FieldKey, string> = { name: "", email: "", phone: "", address: "", city: "", zip: "", note: "" };
const EMPTY_TOUCHED: Record<FieldKey, boolean> = { name: false, email: false, phone: false, address: false, city: false, zip: false, note: false };

// ============ DELIVERY + PAYMENT OPTIONS ============
const PinIcon = (
  <svg aria-hidden="true" className="h-4 w-4 flex-none text-[#087f8c]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 6-7.5 11.25-7.5 11.25S4.5 16.5 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const TruckIcon = (
  <svg aria-hidden="true" className="h-4 w-4 flex-none text-[#087f8c]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.75 18.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.5V6.75a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v9.75m-12 0h12m-12 0H2.25m18 0h1.5m-4.5-9.75h2.379a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 1 .439 1.061v3.129" />
  </svg>
);

const DELIVERY_METHODS: { key: DeliveryMethodKey; label: string; detail: string; icon: React.ReactNode }[] = [
  { key: "pickup", label: "Pickup station", detail: `Ready in ${PICKUP_ETA}`, icon: PinIcon },
  { key: "standard", label: "Home delivery", detail: `Arrives in ${HOME_DELIVERY_ETA}`, icon: TruckIcon },
];

type PaymentKey = "online" | "transfer" | "delivery";
const PAYMENT_METHODS: { key: PaymentKey; label: string; detail: string }[] = [
  { key: "online", label: "Pay online", detail: "Card or bank, through our payment partner" },
  { key: "transfer", label: "Bank transfer", detail: "Pay from your banking app" },
  { key: "delivery", label: "Pay on delivery", detail: "Pay when your order arrives" },
];

const feeLabel = (fee: number) => (fee === 0 ? "FREE" : formatMoney(fee));

// The order number will be issued by the back end; this stand-in only exists for the demo.
const makeOrderRef = () => `GS-${Math.floor(10000 + Math.random() * 90000)}`;

// ============ ANIMATED TOTAL ============
// Counts from the previous total to the new one. Skipped for visitors who prefer reduced motion.
function AnimatedTotal({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frameId = requestAnimationFrame(() => {
        setDisplayed(value);
        fromRef.current = value;
      });
      return () => cancelAnimationFrame(frameId);
    }
    const from = fromRef.current;
    const start = performance.now();
    let frameId: number;
    function frame(now: number) {
      const t = Math.min(1, (now - start) / 350);
      setDisplayed(from + (value - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frameId = requestAnimationFrame(frame);
      else fromRef.current = value;
    }
    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <span>{formatMoney(displayed)}</span>;
}

// ============ STEP ROW (number, connecting line, title, content) ============
function Step({ n, title, hint, done, last, children }: { n: number; title: string; hint?: string; done: boolean; last?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-none bg-[#087f8c] t-body t-w-700 text-white">
          {done ? (
            <svg aria-hidden="true" className="h-4 w-4 motion-safe:animate-[checkoutPop_0.25s_ease-out]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            n
          )}
        </div>
        {!last && (
          <div className="mt-1 w-0.5 flex-1 rounded-none bg-[#e5e7eb]">
            <div className="w-0.5 rounded-none bg-[#087f8c] transition-[height] duration-500" style={{ height: done ? "100%" : "0%" }} />
          </div>
        )}
      </div>
      <div className={`min-w-0 flex-1 ${last ? "" : "pb-10"}`}>
        <h2 className="mb-1 t-title-block t-w-700 text-[#111827]">{title}</h2>
        {hint && <p className="mb-4 t-caption text-[#6b7280]">{hint}</p>}
        {children}
      </div>
    </div>
  );
}

// ============ RADIO-STYLE OPTION CARD ============
function OptionCard({ selected, onSelect, children }: { selected: boolean; onSelect: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`rounded-none border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ad8e2] ${
        selected ? "border-[#087f8c] bg-[#eaf9fa]" : "border-[#e5e7eb] bg-white hover:border-[#087f8c]"
      }`}
    >
      {children}
    </button>
  );
}

const CARD = "rounded-none border border-[#e5e7eb] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, isHydrated } = useCart();

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [form, setForm] = useState<Record<FieldKey, string>>(EMPTY_FORM);
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>(EMPTY_TOUCHED);
  const [attempted, setAttempted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodKey>("pickup");
  const [paymentMethod, setPaymentMethod] = useState<PaymentKey>("online");

  const errors = useMemo(
    () => Object.fromEntries(FIELDS.map((f) => [f.key, f.validate ? f.validate(form[f.key]) : null])) as Record<FieldKey, string | null>,
    [form]
  );
  const shownError = (key: FieldKey) => (touched[key] || attempted ? errors[key] : null);
  const contactComplete = FIELDS.every((f) => !errors[f.key]);
  const termsError = attempted && !agreed ? "Please accept the terms to place your order." : null;

  const fee = deliveryFee(deliveryMethod, cartTotal);
  const orderTotal = cartTotal + fee;
  const selectedDelivery = DELIVERY_METHODS.find((m) => m.key === deliveryMethod) ?? DELIVERY_METHODS[0];
  const selectedPayment = PAYMENT_METHODS.find((m) => m.key === paymentMethod) ?? PAYMENT_METHODS[0];

  const keyframes = `
    @keyframes checkoutPop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    @keyframes chargeFill { from { width: 0%; } to { width: 100%; } }
  `;

  const updateField = (key: FieldKey, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const touch = (key: FieldKey) => setTouched((prev) => ({ ...prev, [key]: true }));

  // ============ LOADING STATE ============
  if (!isHydrated && !submitted) {
    return (
      <div className="mx-auto min-h-[50vh] max-w-lg px-4 py-24 text-center" aria-live="polite">
        <p className="t-body text-[#6b7280]">Loading your cart...</p>
      </div>
    );
  }

  // ============ EMPTY CART STATE ============
  if (cart.length === 0 && !submitted) {
    return (
      <div className="mx-auto min-h-[50vh] max-w-lg px-4 py-24 text-center">
        <h1 className="mb-3 t-hero t-w-700 tracking-[-0.03em] text-[#111827]">Your cart is empty</h1>
        <p className="mb-6 t-body text-[#6b7280]">Add something you need, then come back to check out.</p>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-none bg-[#087f8c] px-6 t-body t-w-700 text-white transition hover:bg-[#0b6e78]">
          Continue shopping
        </Link>
      </div>
    );
  }

  // ============ SUCCESS STATE ============
  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center" aria-live="polite">
        <style>{keyframes}</style>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-[#16a34a] t-hero text-white motion-safe:animate-[checkoutPop_0.3s_ease-out]">✓</div>
        <h1 className="mb-2 t-hero t-w-700 text-[#111827]">Order placed</h1>
        <p className="mb-1 t-body text-[#6b7280]">Thanks, {form.name}. This demo did not send an email or process a payment.</p>
        <p className="mb-1 t-caption text-[#6b7280]">{selectedDelivery.label} · {selectedPayment.label}</p>
        <p className="mb-8 t-caption text-[#6b7280]">ORDER {orderRef}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center rounded-none bg-[#087f8c] px-6 t-body t-w-700 text-white transition hover:bg-[#0b6e78]">Continue shopping</Link>
          <Link href="/orders" className="inline-flex min-h-12 items-center rounded-none border border-[#e5e7eb] bg-white px-6 t-body t-w-700 text-[#374151] hover:bg-[#f9fafb]">View orders</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setAttempted(true);
    const firstInvalid = FIELDS.find((f) => errors[f.key]);
    if (firstInvalid) {
      document.getElementById(firstInvalid.key)?.focus();
      return;
    }
    if (!agreed) {
      document.getElementById("terms")?.focus();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setOrderRef(makeOrderRef());
      setSubmitted(true);
      clearCart();
      setIsSubmitting(false);
    }, 950);
  };

  const renderField = (f: FieldConfig) => (
    <FormField
      key={f.key}
      id={f.key}
      label={f.label}
      value={form[f.key]}
      onChange={(v) => updateField(f.key, v)}
      onBlur={() => touch(f.key)}
      error={shownError(f.key)}
      type={f.type}
      inputMode={f.inputMode}
      placeholder={f.placeholder}
      autoComplete={f.autoComplete}
      hint={f.hint}
      required={f.required !== false}
      multiline={f.multiline}
    />
  );

  // ============ MAIN CHECKOUT ============
  return (
    <div>
      <style>{keyframes}</style>
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2.5 t-body text-[#6b7280]">
          <span className="h-2 w-2 flex-none rounded-none bg-[#16a34a]" aria-hidden="true" />
          Secure checkout · nothing is charged until you confirm
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* ===== LEFT: the steps ===== */}
          <div>
            <Step n={1} title="Contact and shipping" hint="We use these details to deliver your order." done={contactComplete}>
              <div className={`space-y-4 ${CARD}`}>
                {FIELDS.filter((f) => !f.half && !f.multiline).map(renderField)}
                <div className="grid grid-cols-2 gap-3">{FIELDS.filter((f) => f.half).map(renderField)}</div>
                {FIELDS.filter((f) => f.multiline).map(renderField)}
              </div>
            </Step>

            <Step n={2} title="Delivery method" done>
              <div role="radiogroup" aria-label="Delivery method" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DELIVERY_METHODS.map((method) => (
                  <OptionCard key={method.key} selected={method.key === deliveryMethod} onSelect={() => setDeliveryMethod(method.key)}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-2 t-body t-w-700 text-[#111827]">{method.icon}{method.label}</span>
                      <span className={`t-caption t-w-700 ${deliveryFee(method.key, cartTotal) === 0 ? "text-[#16a34a]" : "text-[#111827]"}`}>{feeLabel(deliveryFee(method.key, cartTotal))}</span>
                    </div>
                    <p className="mt-1 t-caption text-[#6b7280]">{method.detail}</p>
                  </OptionCard>
                ))}
              </div>
            </Step>

            <Step n={3} title="Payment method" hint="You are not charged in this demo." done>
              <div role="radiogroup" aria-label="Payment method" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {PAYMENT_METHODS.map((method) => (
                  <OptionCard key={method.key} selected={method.key === paymentMethod} onSelect={() => setPaymentMethod(method.key)}>
                    <span className="t-body t-w-700 text-[#111827]">{method.label}</span>
                    <p className="mt-1 t-caption text-[#6b7280]">{method.detail}</p>
                  </OptionCard>
                ))}
              </div>
            </Step>

            <Step n={4} title="Review" done={agreed} last>
              <p className="mb-4 t-body text-[#6b7280]">Check your order summary, then place the order.</p>
              <label className="flex cursor-pointer items-start gap-3 t-body text-[#374151]">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  aria-invalid={termsError ? true : undefined}
                  aria-describedby={termsError ? "terms-error" : undefined}
                  className="mt-1 h-4 w-4 flex-none accent-[#17b5c9]"
                />
                <span>
                  I agree to the <Link href="/info/terms" className="text-[#087f8c] underline">Terms of Service</Link> and the{" "}
                  <Link href="/info/returns" className="text-[#087f8c] underline">Returns policy</Link>.
                </span>
              </label>
              {termsError && <p id="terms-error" role="alert" className="mt-2 t-caption text-[#dc2626]">{termsError}</p>}
            </Step>
          </div>

          {/* ===== RIGHT: order summary ===== */}
          <aside className={`h-fit ${CARD} lg:sticky lg:top-28`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="t-title-section t-w-700 uppercase tracking-wide text-[#111827]">Order summary</h2>
              <span className="t-badge text-[#6b7280]">{cart.length} {cart.length === 1 ? "item" : "items"}</span>
            </div>

            <ul className="mb-5 space-y-3">
              {cart.map((item) => (
                <li key={cartLineId(item)} className="flex items-center gap-3">
                  <Image src={item.image} alt="" width={44} height={44} sizes="44px" className="h-11 w-11 flex-none rounded-none border border-[#e5e7eb] bg-[#f8fafc] object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate t-body t-w-500 text-[#111827]">{item.title}</p>
                    <p className="truncate t-caption text-[#6b7280]">{item.variant ? `${variantLabel(item.variant)} · ` : ""}QTY {item.quantity}</p>
                  </div>
                  <span className="t-body t-w-500 text-[#111827]">{formatMoney(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-[#e5e7eb] pt-4 t-body text-[#6b7280]">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-[#111827]">{formatMoney(cartTotal)}</span></div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span key={fee} className={`t-w-500 motion-safe:animate-[checkoutPop_0.2s_ease-out] ${fee === 0 ? "text-[#16a34a]" : "text-[#111827]"}`}>{feeLabel(fee)}</span>
              </div>
              <div className="flex justify-between"><span>Payment</span><span className="text-[#111827]">{selectedPayment.label}</span></div>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-[#e5e7eb] pt-4">
              <span className="t-body t-w-700 text-[#111827]">Total</span>
              <span className="t-title-block t-w-700 text-[#111827]"><AnimatedTotal value={orderTotal} /></span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative mt-5 w-full overflow-hidden rounded-none bg-[#087f8c] py-3.5 t-body t-w-700 text-white transition hover:bg-[#0b6e78] disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ad8e2]"
            >
              {isSubmitting && <div aria-hidden="true" className="absolute inset-y-0 left-0 w-0 bg-white/25 motion-safe:animate-[chargeFill_0.9s_linear_forwards]" />}
              <span className="relative">{isSubmitting ? "Placing order..." : "Place order"}</span>
            </button>

            {attempted && !contactComplete && <p role="alert" className="mt-3 text-center t-caption text-[#dc2626]">Please fix the highlighted fields above.</p>}
            <p className="mt-3 text-center t-caption text-[#6b7280]">Free returns within {RETURN_WINDOW_DAYS} days · demo checkout, no payment collected</p>
          </aside>
        </form>
      </div>
    </div>
  );
}
