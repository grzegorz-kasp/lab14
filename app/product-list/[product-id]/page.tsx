import { getProductById } from "../../../lib/products-data";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    "product-id": string;
  }>;
};

const categorySlugMap: Record<string, string> = {
  "karta graficzna": "gpu",
  "procesor": "cpu",
  "pamięć ram": "ram",
  "dysk": "disk",
};

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams["product-id"]);
  if (Number.isNaN(id)) return notFound();

  const product = getProductById(id);
  if (!product) return notFound();

  const imageSrc = "/img/produkt.jpg";
  const categorySlug = categorySlugMap[product.type];

  return (
    <main className="min-h-screen py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">{product.name}</h2>
      <section className="max-w-[800px] mx-auto bg-white p-6 rounded shadow">
        <Link href={`/product-list/${id}/image`} className="block cursor-pointer">
          <img 
            src={imageSrc} 
            alt={product.name} 
            className="max-w-[320px] mx-auto mb-4 hover:opacity-80 transition-opacity" 
          />
        </Link>
        <div className="space-y-1 text-black mb-4">
          <div>Typ: {product.type}</div>
          <div>Kod: {product.code}</div>
          <div>Ilość: {product.amount} szt.</div>
          <div>Cena: {product.price} zł</div>
          <div>Dodano: {new Date(product.date).toLocaleDateString()}</div>
        </div>
        <div className="text-black mb-4">{product.description}</div>
        
        <div className="space-y-2">
          {categorySlug && (
            <div>
              <Link href={`/product-list/list/${categorySlug}`} className="text-blue-600 hover:underline">
                → Zobacz wszystkie produkty z kategorii: {product.type}
              </Link>
            </div>
          )}
          <div>
            <Link href="/product-list" className="text-blue-600 hover:underline">
              ← Powrót do listy produktów
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
