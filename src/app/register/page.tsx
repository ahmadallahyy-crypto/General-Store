import { RegisterForm } from "@/components/auth/register-form";
import { safeRedirectPath } from "@/lib/validation";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <RegisterForm next={safeRedirectPath(next)} />;
}
