import { getFavorites } from "@/features/books/actions/get-favorites";
import { BookCard } from "@/features/books/components/BookCard";
import { FavoriteButton } from "@/features/books/components/FavoriteButton";

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Favorites</h1>

      {favorites.length === 0 ? (
        <p>You haven't favorited any books yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map(({ book }) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author.name}
              coverUrl={book.coverUrl ?? undefined}
              publishedYear={book.publishedYear}
              type={book.type}
              action={<FavoriteButton bookId={book.id} />}
            />
          ))}
        </div>
      )}
    </main>
  );
}
