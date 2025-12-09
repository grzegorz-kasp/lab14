import Link from "next/link";

export default function OrderHistoryNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony historii zakupów</h1>
      <p>Nie można znaleźć tej podstrony historii zamówień.</p>
      <p>
        <Link href="/order-history">Wróć do historii zakupów</Link>
      </p>
      <p>
        <Link href="/">Przejdź do strony głównej</Link>
      </p>
    </main>
  );
}
