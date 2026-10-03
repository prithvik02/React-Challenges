type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

export default function SearchPage({
  searchParams,
}: SearchPageProps) {
  const query = searchParams.q || "";

  return (
    <main>
      <h1>Search</h1>

      {query ? (
        <p>Search results for: {query}</p>
      ) : (
        <p>Enter a search query.</p>
      )}
    </main>
  );
}