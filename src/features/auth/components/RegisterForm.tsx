"use client";

import { useActionState } from "react";

import { registerAction } from "../actions/register";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="block mb-1">Name</label>

        <input name="name" type="text" className="w-full rounded border p-2" />

        {state.errors?.name && (
          <p className="text-sm text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Email</label>

        <input
          name="email"
          type="email"
          className="w-full rounded border p-2"
        />

        {state.errors?.email && (
          <p className="text-sm text-red-500">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Password</label>

        <input
          name="password"
          type="password"
          className="w-full rounded border p-2"
        />

        {state.errors?.password && (
          <p className="text-sm text-red-500">{state.errors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Creating Account..." : "Create Account"}
      </button>

      {state.message && (
        <p className={state.success ? "text-green-600" : "text-red-600"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
