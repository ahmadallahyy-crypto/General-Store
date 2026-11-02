// Small, dependency-free field checks shared by checkout, login, sign-up and contact forms.
// Each returns an error message, or null when the value is fine. The same rules should also run on
// the server once there is one (never trust the browser alone).

export type Validator = (value: string) => string | null;

export const required = (label: string): Validator => (v) => (v.trim() ? null : `${label} is required.`);

export const validateName: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Full name is required.";
  return t.length < 2 ? "Please enter your full name." : null;
};

export const validateEmail: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Email is required.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t) ? null : "Enter a valid email address, like name@example.com.";
};

// Accepts +234 801 234 5678, 0801-234-5678, (0801) 2345678 ... and checks the digit count.
export const validatePhone: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Phone number is required.";
  if (!/^[+\d][\d\s()-]*$/.test(t)) return "Use digits only (you can start with +).";
  const digits = t.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15 ? null : "Enter a valid phone number (7 to 15 digits).";
};

export const validateAddress: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Address is required.";
  return t.length < 5 ? "Please enter the full street address." : null;
};

export const validateCity: Validator = (v) => {
  const t = v.trim();
  if (!t) return "City is required.";
  return t.length < 2 ? "Please enter a valid city." : null;
};

export const validatePassword: Validator = (v) => {
  if (!v) return "Password is required.";
  return v.length < 8 ? "Use at least 8 characters." : null;
};

export const validateMessage: Validator = (v) => {
  const t = v.trim();
  if (!t) return "Please write a message.";
  return t.length < 10 ? "Tell us a little more (at least 10 characters)." : null;
};

// Only allow redirects to pages on this site (stops "?next=https://evil.example" tricks).
export function safeRedirectPath(next: string | undefined | null, fallback = "/account"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
