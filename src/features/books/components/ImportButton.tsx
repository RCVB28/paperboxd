"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import { importBook } from "../actions/import-books";
import type { ImportBookInput } from "../types/import-books";

interface ImportBookButtonProps {
  book: ImportBookInput;
}

export function ImportBookButton({ book }: ImportBookButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await importBook(book);

      setSuccess(result.success);
      setMessage(result.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        isLoading={isLoading}
        onClick={handleImport}
      >
        {isLoading ? "Importing..." : "Import"}
      </Button>

      {message && (
        <Alert variant={success ? "success" : "error"} className="mt-2">
          {message}
        </Alert>
      )}
    </>
  );
}
