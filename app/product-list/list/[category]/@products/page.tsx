import { getProductsByCategory, type ProductType } from "../../../../../lib/products-data";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    category: string;
  }>;
};

const categoryMap: Record<string, ProductType> = {
  gpu: "karta graficzna",
  cpu: "procesor",
  ram: "pamięć ram",
  disk: "dysk",
};

const categoryNames: Record<string, string> = {
  gpu: "Karty graficzne",
  cpu: "Procesory",
  ram: "Pamięć RAM",
  disk: "Dyski",
};

export default async function CategoryProductsSlot({ params }: Props) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  
  const categoryType = categoryMap[categorySlug];
  if (!categoryType) {
    return notFound();
  }

  const products = getProductsByCategory(categoryType);
  const categoryName = categoryNames[categorySlug] || categoryType;

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6">{categoryName}</h2>
      
      <section className="max-w-[1100px] mx-auto mb-6">
        <div className="bg-white p-4 rounded shadow text-black">
          <p>Znaleziono <strong>{products.length}</strong> produktów w kategorii <strong>{categoryName}</strong></p>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((p) => (
            <li key={p.id} className="bg-white p-3 rounded shadow hover:shadow-md transition-shadow flex flex-col text-center">
              <div className="font-semibold text-base mb-2 flex-grow">
                <Link href={`/product-list/${p.id}`} className="text-blue-600 hover:underline">
                  {p.name}
                </Link>
              </div>
              <div className="text-xs text-gray-600 space-y-0.5">
                <div>{p.type}</div>
                <div>{p.amount} szt.</div>
                <div className="font-bold text-gray-800">{p.price} zł</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="max-w-[1100px] mx-auto mt-6">
        <Link href="/product-list" className="text-blue-600 hover:underline">
          ← Powrót do wszystkich produktów
        </Link>
      </div>
    </div>
  );
}
