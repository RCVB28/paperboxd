import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold">Welcome back, {session.user.name}!</h1>

      <p className="mt-2 text-zinc-600">Signed in as {session.user.email}</p>

      <div className="mt-8 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Account</h2>

        <div className="mt-4 space-y-2">
          <p>
            <strong>ID:</strong> {session.user.id}
          </p>

          <p>
            <strong>Role:</strong> {session.user.role}
          </p>
        </div>
      </div>
    </main>
  );
}
