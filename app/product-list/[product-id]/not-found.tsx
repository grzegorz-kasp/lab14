import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Produkt nie znaleziony</h2>
      <p className="mb-6 text-gray-600">Nie ma produktu o podanym ID lub nieprawidłowy adres.</p>
      <div className="flex gap-4">
        <Link href="/product-list" className="text-blue-600 hover:underline">
          ← Powrót do listy produktów
        </Link>
        <Link href="/" className="text-blue-600 hover:underline">
          Strona główna
        </Link>
      </div>
    </main>
  );
}
