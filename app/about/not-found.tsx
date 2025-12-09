import Link from "next/link";

export default function AboutNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony o sklepie</h1>
      <p>Wybrana strona informacyjna nie istnieje.</p>
      <p>
        <Link href="/about">Wróć do strony 'O sklepie'</Link>
      </p>
      <p>
        <Link href="/">Przejdź do strony głównej</Link>
      </p>
    </main>
  );
}
