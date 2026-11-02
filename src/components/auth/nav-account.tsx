"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";

const icon = "h-[18px] w-[18px]";

// "Login" in the top bar. Shows the first name once signed in, and opens the account page.
export function NavAccountLink() {
  const { user, isHydrated } = useAuth();
  const signedIn = isHydrated && user;
  return (
    <Link
      href={signedIn ? "/account" : "/login"}
      aria-label={signedIn ? `My account, ${user.name}` : "Login"}
      title={signedIn ? "My account" : "Sign in or create an account"}
      className="nav-narrow-action flex h-12 max-w-[11rem] items-center gap-2 px-2 text-[14px] font-medium leading-tight tracking-[0.01em] text-[#404040] transition hover:bg-[#eaf9fa] sm:px-3"
    >
      <svg aria-hidden="true" className={`${icon} flex-none`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
      </svg>
      <span className="hidden truncate sm:inline">{signedIn ? user.name.split(" ")[0] : "Login"}</span>
    </Link>
  );
}

// Bell: signed-in shoppers go to their account; everyone else is asked to sign in.
export function NavBellLink() {
  const { user, isHydrated } = useAuth();
  return (
    <Link
      href={isHydrated && user ? "/account" : "/login?next=/account"}
      aria-label="Notifications"
      title={isHydrated && user ? "Your account" : "Sign in to see notifications"}
      className="nav-narrow-secondary flex h-12 w-12 items-center justify-center text-[#404040] transition hover:bg-[#eaf9fa]"
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9m9-6a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8Zm-4.5 8a2.5 2.5 0 0 1-5 0" />
      </svg>
    </Link>
  );
}
