"use client";

import * as React from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { toggleFavorite } from "../actions/favorite-books";

interface FavoriteButtonProps {
  bookId: string;
  /** True favorited status fetched server-side for the current user. */
  initialFavorited?: boolean;
}

export function FavoriteButton({
  bookId,
  initialFavorited = false,
}: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [favorited, setFavorited] = React.useState(initialFavorited);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const result = await toggleFavorite(bookId);

      if (result.success && typeof result.favorited === "boolean") {
        setFavorited(result.favorited);
      } else {
        alert(result.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={favorited ? "secondary" : "primary"}
      isLoading={isLoading}
      onClick={handleClick}
    >
      <Heart className={`mr-2 h-4 w-4 ${favorited ? "fill-current" : ""}`} />

      {favorited ? "Favorited" : "Favorite"}
    </Button>
  );
}
