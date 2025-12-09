import Image from "next/image";
import Link from "next/link";

export default function ImagePage() {
  return (
    <main className="min-h-screen py-8 px-4 bg-gray-100">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Zdjęcie produktu</h2>
        
        <div className="bg-white p-6 rounded shadow">
          <Image
            src="/img/produkt.jpg"
            alt="Produkt - pełny rozmiar"
            width={1200}
            height={800}
            className="w-full h-auto"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        
        <div className="mt-6 text-center">
          <Link href=".." className="text-blue-600 hover:underline text-lg">
            ← Powrót do produktu
          </Link>
        </div>
      </div>
    </main>
  );
}
