import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between max-w-5xl mx-auto p-6">
      <Link href="/">GameLists</Link>
      <nav className="flex gap-3">
        <Link href="/games">Games</Link>
        <Link href="/lists">Lists</Link>
        <Link href="/">Profile</Link>
      </nav>
    </header>
  );
}
