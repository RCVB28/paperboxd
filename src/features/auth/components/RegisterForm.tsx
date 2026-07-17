"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schemas/register.schema";
import { z } from "zod";
import Link from "next/link";
import { register as registerAction } from "../actions/register";
import { Alert } from "@/components/ui/Alert";
import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthLogo } from "../../../components/branding/Logo";
import { AuthField } from "./AuthField";

// ─── BookMark glyph — signature visual element ───────────────────────────────
// A simple open-book SVG that acts as a wordmark/logo substitute on auth pages.
// Kept inline so auth pages have no layout dependency on the Navbar.

type RegisterFormValues = z.infer<typeof RegisterSchema>;

// ─── RegisterForm ─────────────────────────────────────────────────────────────

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [feedback, setFeedback] = React.useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const redirectTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      {/* Brand mark above the card */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <AuthLogo />
        <span className="text-sm font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
          Paperboxd
        </span>
      </div>

      <Card className="w-full max-w-md shadow-md dark:border-zinc-800">
        {/* ── Header ── */}
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Create an account
          </CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track your reading, write reviews, and discover your next favourite
            book or comic.
          </p>
        </CardHeader>

        {/* ── Form body ── */}
        <CardContent>
          {feedback && (
            <Alert
              variant={feedback.variant}
              title={
                feedback.variant === "success"
                  ? "Success"
                  : "Registration Failed"
              }
              className="mb-4"
            >
              {feedback.message}
            </Alert>
          )}
          <form
            onSubmit={handleSubmit(async (data) => {
              // Clear previous feedback and show loading
              setFeedback(null);
              setIsSubmitting(true);

              try {
                const formData = new FormData();

                Object.entries(data).forEach(([key, value]) => {
                  formData.append(key, value);
                });

                const result = await registerAction(
                  {
                    success: false,
                    message: "",
                  },
                  formData,
                );

                setFeedback({
                  variant: result.success ? "success" : "error",
                  message: result.message,
                });
                if (result.success) {
                  redirectTimeout.current = setTimeout(() => {
                    router.push("/login");
                  }, 1500);
                }
              } catch {
                setFeedback({
                  variant: "error",
                  message: "Something went wrong. Please try again.",
                });
              } finally {
                // Always stop loading
                setIsSubmitting(false);
              }
            })}
            noValidate
          >
            <div className="flex flex-col gap-4">
              <AuthField
                id="name"
                label="Name"
                placeholder="Ada Lovelace"
                autoComplete="name"
                required
                error={errors.name?.message}
                {...register("name")}
              />
              <AuthField
                id="email"
                label="Email"
                type="email"
                placeholder="ada@example.com"
                autoComplete="email"
                required
                error={errors.email?.message}
                {...register("email")}
              />

              <AuthField
                id="password"
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                hint="Use letters, numbers, and symbols for a stronger password."
                error={errors.password?.message}
                {...register("password")}
              />

              <AuthField
                id="confirmPassword"
                label="Confirm password"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              {/* ── Divider ── */}
              <div className="pt-1" />

              {/* ── Submit ── */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>

              {/* ── Sign-in redirect ── */}
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-amber-700 hover:underline dark:text-amber-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Fine print ── */}
      <p className="mt-6 max-w-xs text-center text-xs text-zinc-400 dark:text-zinc-600">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline hover:text-zinc-600">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-zinc-600">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
