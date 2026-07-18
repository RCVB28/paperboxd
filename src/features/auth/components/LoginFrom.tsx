"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schemas/login.schema"; // Updated import schema path
import { z } from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Alert } from "@/components/ui/Alert";
import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthLogo } from "../../../components/branding/Logo";
import { AuthField } from "./AuthField";

type LoginFormValues = z.infer<typeof LoginSchema>;

// ─── LoginForm ───────────────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
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
            Sign in to your account
          </CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Welcome back! Enter your details below to access your logs, reviews,
            and lists.
          </p>
        </CardHeader>

        {/* ── Form body ── */}
        <CardContent>
          {feedback && (
            <Alert
              variant={feedback.variant}
              title={
                feedback.variant === "success" ? "Success" : "Sign In Failed"
              }
              className="mb-4"
            >
              {feedback.message}
            </Alert>
          )}
          <form
            onSubmit={handleSubmit(async (data) => {
              setFeedback(null);
              setIsSubmitting(true);

              try {
                const result = await signIn("credentials", {
                  email: data.email,
                  password: data.password,
                  redirect: false,
                });

                if (result?.error) {
                  setFeedback({
                    variant: "error",
                    message: "Invalid email or password.",
                  });

                  return;
                }

                setFeedback({
                  variant: "success",
                  message: "Login successful.",
                });

                redirectTimeout.current = setTimeout(() => {
                  router.push("/dashboard");
                }, 1000);
              } finally {
                setIsSubmitting(false);
              }
            })}
            noValidate
          >
            <div className="flex flex-col gap-4">
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  {/* Note: If your AuthField component handles rendering its own label, 
                      you can alternative link a reset flow inside the AuthField component 
                      props or keep this classic structural arrangement. */}
                </div>
                <AuthField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  error={errors.password?.message}
                  {...register("password")}
                />
                <div className="mt-1.5 flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-amber-700 hover:underline dark:text-amber-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

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
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>

              {/* ── Sign-up redirect ── */}
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                New to Paperboxd?{" "}
                <Link
                  href="/register"
                  className="font-medium text-amber-700 hover:underline dark:text-amber-500"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Fine print ── */}
      <p className="mt-6 max-w-xs text-center text-xs text-zinc-400 dark:text-zinc-600">
        By signing in you agree to our{" "}
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
