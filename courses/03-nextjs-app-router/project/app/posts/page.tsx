import PostForm from "../components/PostForm";

type Post = {
  id: number;
  title: string;
  body: string;
};

type PostsPageProps = {
  searchParams: {
    q?: string;
  };
};

async function getPosts(): Promise<Post[]> {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export default async function PostsPage({
  searchParams,
}: PostsPageProps) {
  const posts = await getPosts();
  const query = searchParams.q?.toLowerCase() || "";

  const filteredPosts = query
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      )
    : posts;

  return (
    <main>
      <h1>Posts</h1>

      <PostForm />

      <form method="get">
        <input
          type="text"
          name="q"
          placeholder="Search posts"
          defaultValue={searchParams.q || ""}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {filteredPosts.map((post) => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}