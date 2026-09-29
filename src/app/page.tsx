import Link from "next/link";

export default function Home() {
  return (
    <main className="home-shell">
      <h1>IDEIS Schedule Lab</h1>
      <nav>
        <Link href="/Plany/PlanyTokow/1406">Open schedule (Tok 1406)</Link>
        <Link href="/Plany/PlanyTokow/1203">Open schedule (Tok 1203)</Link>
        <Link href="/admin">Open admin</Link>
      </nav>
    </main>
  );
}
