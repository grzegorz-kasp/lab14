"use client";

import {
  getAllProductsAlphabetical,
  getAllProductsNewest,
  getProductsByCategory,
  type ProductType,
} from "../../../lib/products-data";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function ProductsSlot() {
  const [sort, setSort] = useState<"alpha" | "newest">("alpha");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [category, setCategory] = useState<ProductType | "all">("all");

  const categoryFiltered = useMemo(() => {
    if (category === "all") {
      return sort === "newest" ? getAllProductsNewest() : getAllProductsAlphabetical();
    }
    // Get products by category and sort them
    const categoryProducts = getProductsByCategory(category);
    if (sort === "newest") {
      return [...categoryProducts].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    return [...categoryProducts].sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }, [category, sort]);
  
  const filtered = useMemo(
    () => (inStockOnly ? categoryFiltered.filter((p) => p.amount > 0) : categoryFiltered),
    [categoryFiltered, inStockOnly]
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6">Lista produktów</h2>

      <section className="max-w-[1100px] mx-auto mb-6 p-4 bg-white rounded shadow">
        <div className="space-y-4 text-black">
          {/* Kategorie */}
          <div>
            <h3 className="font-semibold mb-2">Kategoria:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory("all")}
                className={`px-4 py-2 rounded transition-colors ${
                  category === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Wszystkie
              </button>
              <button
                onClick={() => setCategory("procesor")}
                className={`px-4 py-2 rounded transition-colors ${
                  category === "procesor"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Procesory
              </button>
              <button
                onClick={() => setCategory("karta graficzna")}
                className={`px-4 py-2 rounded transition-colors ${
                  category === "karta graficzna"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Karty graficzne
              </button>
              <button
                onClick={() => setCategory("pamięć ram")}
                className={`px-4 py-2 rounded transition-colors ${
                  category === "pamięć ram"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Pamięć RAM
              </button>
              <button
                onClick={() => setCategory("dysk")}
                className={`px-4 py-2 rounded transition-colors ${
                  category === "dysk"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Dyski
              </button>
            </div>
          </div>

          {/* Sortowanie i filtrowanie */}
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value="alpha"
                  checked={sort === "alpha"}
                  onChange={() => setSort("alpha")}
                  className="cursor-pointer"
                />
                Alfabetycznie
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value="newest"
                  checked={sort === "newest"}
                  onChange={() => setSort("newest")}
                  className="cursor-pointer"
                />
                Najnowsze
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="cursor-pointer"
                />
                Tylko dostępne
              </label>
            </div>
          </div>

          {/* Licznik produktów */}
          <div className="text-sm text-gray-600">
            Wyświetlono: <strong>{filtered.length}</strong> produktów
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((p) => (
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
    </div>
  );
}
