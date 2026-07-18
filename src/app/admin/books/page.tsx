import { SearchBooks } from "@/features/books/components/SearchBooks";

export default function AdminBooksPage() {
  return (
    <main className="container mx-auto py-8">
      <SearchBooks mode="admin" />
    </main>
  );
}
