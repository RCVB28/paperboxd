"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, type InputProps } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schemas/register.schema";
import { z } from "zod";
import Link from "next/link";

// ─── BookMark glyph — signature visual element ───────────────────────────────
// A simple open-book SVG that acts as a wordmark/logo substitute on auth pages.
// Kept inline so auth pages have no layout dependency on the Navbar.

type RegisterFormValues = z.infer<typeof RegisterSchema>;

function BookGlyph() {
  return (
    <svg
      viewBox="0 0 40 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-auto"
      aria-hidden="true"
    >
      {/* Left page */}
      <path
        d="M20 4C20 4 12 2 4 4V24C12 22 20 24 20 24"
        stroke="#b45309"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right page */}
      <path
        d="M20 4C20 4 28 2 36 4V24C28 22 20 24 20 24"
        stroke="#b45309"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spine */}
      <line
        x1="20"
        y1="4"
        x2="20"
        y2="24"
        stroke="#b45309"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Left text lines */}
      <line
        x1="8"
        y1="10"
        x2="17"
        y2="10"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="8"
        y1="14"
        x2="17"
        y2="14"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="8"
        y1="18"
        x2="14"
        y2="18"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Right text lines */}
      <line
        x1="23"
        y1="10"
        x2="32"
        y2="10"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="23"
        y1="14"
        x2="32"
        y2="14"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="23"
        y1="18"
        x2="29"
        y2="18"
        stroke="#b45309"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

// ─── Field — Label + Input stacked, reused per field ─────────────────────────

interface FieldProps extends InputProps {
  id: string;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

function Field({ label, hint, error, required, ...inputProps }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={inputProps.id} required={required} hint={hint}>
        {label}
      </Label>

      <Input error={error} {...inputProps} />
    </div>
  );
}

// ─── RegisterForm ─────────────────────────────────────────────────────────────

export function RegisterForm() {
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      {/* Brand mark above the card */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <BookGlyph />
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
          {/*
            onSubmit is left as a no-op placeholder.
            React Hook Form + server action wired in the next phase.
          */}
          <form
            onSubmit={handleSubmit((data) => {
              console.log(data);
            })}
            noValidate
          >
            <div className="flex flex-col gap-4">
              <Field
                id="name"
                label="Name"
                placeholder="Ada Lovelace"
                autoComplete="name"
                required
                error={errors.name?.message}
                {...register("name")}
              />
              <Field
                id="email"
                label="Email"
                type="email"
                placeholder="ada@example.com"
                autoComplete="email"
                required
                error={errors.email?.message}
                {...register("email")}
              />

              <Field
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

              <Field
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
              <Button type="submit" variant="primary" size="md" fullWidth>
                Create account
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
