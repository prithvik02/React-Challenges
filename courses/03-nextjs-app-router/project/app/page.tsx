import Image from "next/image";
import Link from "next/link";
import Counter from "./components/Counter";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>

      <p>This page is a Server Component.</p>

      <Link href="/about">About</Link>

      <Image
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
      />

      <Counter />
    </main>
  );
}