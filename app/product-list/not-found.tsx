import Link from "next/link";

export default function ProductListNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony produktów</h1>
      <p>Wybrana strona produktów nie jest dostępna.</p>
      <p>
        <Link href="/product-list">Wróć do listy produktów</Link>
      </p>
      <p>
        <Link href="/">Przejdź do strony głównej</Link>
      </p>
    </main>
  );
}
