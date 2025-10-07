import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between max-w-5xl mx-auto p-6">
      <Link href="/">Game Lists</Link>
      <nav className="flex gap-3">
        <Link href="/">Games</Link>
        <Link href="/">Lists</Link>
        <Link href="/">Profile</Link>
      </nav>
    </header>
  );
}
