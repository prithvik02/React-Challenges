import Link from "next/link";
import Counter from "./components/Counter";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>

      <p>This page is a Server Component.</p>

      <Link href="/about">About</Link>

      <Counter />
    </main>
  );
}