"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <h1>Something went wrong</h1>

      <p>There was an error loading this page.</p>

      <button onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}