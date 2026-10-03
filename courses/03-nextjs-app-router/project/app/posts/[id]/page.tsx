type PageProps = {
  params: {
    id: string;
  };
};

export const dynamic = 'force-dynamic';

export default function PostPage({ params }: PageProps) {
  return (
    <main>
      <h1>Post {params.id}</h1>
      <p>This is the post with ID {params.id}.</p>
    </main>
  );
}