import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Nie znaleziono strony</h1>
      <p className="mb-6 text-gray-600">Strona, której szukasz, nie istnieje.</p>
      <p>
        <Link href="/" className="text-blue-600 hover:underline">
          Przejdź do strony głównej
        </Link>
      </p>
    </main>
  );
}
