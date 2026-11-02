import type { ChangeEvent } from "react";

// One light-themed form field (label + input/textarea + inline error) used by every form on the site.
// Pass `error` only when it should be visible (e.g. after the field was touched).

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  inputMode?: "text" | "tel" | "email" | "numeric";
};

const base =
  "w-full rounded-none border bg-[#f9fafb] px-3.5 py-2.5 t-body text-[#111827] outline-none placeholder:text-[#6b7280] focus:border-[#087f8c]";

export function FormField({ id, label, value, onChange, onBlur, error, type = "text", placeholder, autoComplete, hint, required = true, multiline, rows = 3, inputMode }: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const common = {
    id,
    name: id,
    value,
    placeholder,
    autoComplete,
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `${base} ${error ? "border-[#dc2626]" : "border-[#e5e7eb]"}`,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block t-caption t-w-500 uppercase tracking-wide text-[#6b7280]">
        {label}
        {!required && <span className="ml-1 normal-case tracking-normal text-[#6b7280]">(optional)</span>}
      </label>
      {multiline ? <textarea {...common} rows={rows} /> : <input {...common} type={type} inputMode={inputMode} />}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 t-caption text-[#dc2626]">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 t-caption text-[#6b7280]">{hint}</p>
      ) : null}
    </div>
  );
}
