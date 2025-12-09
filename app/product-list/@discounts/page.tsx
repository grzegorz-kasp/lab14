"use client";

import { getAllProductsAlphabetical } from "../../../lib/products-data";
import Link from "next/link";
import { useMemo } from "react";

// Funkcja do generowania "losowej" ale deterministycznej kolejności na podstawie daty
function getSeededRandomProducts(products: ReturnType<typeof getAllProductsAlphabetical>, count: number) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Proste deterministyczne "losowanie" oparte na seed
  const seededProducts = [...products].sort((a, b) => {
    const hashA = (a.id * seed) % 1000;
    const hashB = (b.id * seed) % 1000;
    return hashA - hashB;
  });
  
  return seededProducts.slice(0, count);
}

export default function DiscountsSlot() {
  const discountProducts = useMemo(() => {
    const allProducts = getAllProductsAlphabetical();
    return getSeededRandomProducts(allProducts, 3);
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-red-600">🔥 Promocje -10% 🔥</h2>
      
      <section className="max-w-[1100px] mx-auto">
        <div className="flex gap-4 justify-center flex-wrap">
          {discountProducts.map((product) => {
            const originalPrice = product.price;
            const discountPrice = Math.round(originalPrice * 0.9);

            return (
              <div
                key={product.id}
                className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-red-200 flex-1 min-w-[250px] max-w-[350px]"
              >
                <div className="text-center">
                  <div className="font-bold text-lg mb-2">
                    <Link href={`/product-list/${product.id}`} className="text-blue-600 hover:underline">
                      {product.name}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{product.type}</div>
                  <div className="text-sm text-gray-600 mb-3">{product.amount} szt.</div>
                  
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="text-gray-500 line-through text-lg">
                      {originalPrice} zł
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {discountPrice} zł
                    </div>
                  </div>
                  
                  <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -10%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
