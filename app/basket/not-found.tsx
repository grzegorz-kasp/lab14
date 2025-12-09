import Link from "next/link";

export default function BasketNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony koszyka</h1>
      <p>Strona koszyka nie jest dostępna.</p>
      <p>
        <Link href="/basket">Wróć do koszyka</Link>
      </p>
      <p>
        <Link href="/">Przejdź do strony głównej</Link>
      </p>
    </main>
  );
}
