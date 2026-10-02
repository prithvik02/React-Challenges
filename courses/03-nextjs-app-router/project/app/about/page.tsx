import Link from "next/link";

export default function About() {
  return (
    <main>
      <h1>About</h1>
      <p>This is the about page.</p>
      <Link href="/">Home</Link>
    </main>
  );
}