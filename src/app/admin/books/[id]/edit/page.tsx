import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { getAdminBookById } from "@/features/books/actions/admin-get-books";
import { EditBookForm } from "@/features/books/components/EditBookForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Independent server-side check, same reasoning as the list page.
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/books");
  }

  const user = session.user;

  const { id } = await params;
  const book = await getAdminBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        user={{
          name: user.name ?? "Admin",
          avatarUrl: user.image,
          role: user.role,
        }}
        authActions={<AuthActions />}
        userMenu={<UserMenu name={user.name ?? "Admin"} />}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <Link
            href="/admin/books"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-500"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Manage Books
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Edit Book
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Update details for &ldquo;{book.title}&rdquo;.
            </p>
          </div>

          <EditBookForm book={book} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
