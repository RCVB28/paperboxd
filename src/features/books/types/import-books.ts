export interface ImportBookInput {
  openLibraryKey: string;

  title: string;

  author: string;

  coverUrl?: string;

  publishedYear?: number;

  type: "BOOK" | "COMIC";
}
