import { searchBooks } from "@/features/books/services/open-library.service";

export default async function TestPage() {
  const books = await searchBooks("Harry Potter");

  return (
    <main className="p-8">
      <pre>{JSON.stringify(books, null, 2)}</pre>
    </main>
  );
}
