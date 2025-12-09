import Link from "next/link";

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function ProductsPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <main className="min-h-screen py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Produkty - Catch-all Segment</h2>
      <section className="max-w-[800px] mx-auto bg-white p-6 rounded shadow">
        <div className="mb-4 text-black">
          <strong>Aktualna ścieżka:</strong>
          <div className="mt-2 p-3 bg-gray-100 rounded font-mono text-sm">
            /products/{slug.join("/")}
          </div>
        </div>
        
        <div className="mb-4 text-black">
          <strong>Segmenty (slug):</strong>
          <ul className="mt-2 list-disc list-inside">
            {slug.map((segment, index) => (
              <li key={index}>
                Segment {index}: <span className="font-mono">{segment}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-black">
          <p className="mb-4">
            Ten segment uniwersalny (catch-all) może obsłużyć dowolną liczbę segmentów URL:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>/products/a</li>
            <li>/products/a/b</li>
            <li>/products/a/b/c</li>
          </ul>
        </div>

        <div className="mt-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Powrót do strony głównej
          </Link>
        </div>
      </section>
    </main>
  );
}
