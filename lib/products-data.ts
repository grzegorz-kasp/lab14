import productsJson from "../data/products.json";

export type ProductType = "procesor" | "karta graficzna" | "pamięć ram" | "dysk";

export interface Product {
  id: number;
  code: string;
  name: string;
  type: ProductType;
  price: number;
  amount: number;
  description: string;
  date: string; // ISO
  image: string;
}

// Load products once at build/runtime
const allProducts: Product[] = productsJson as Product[];

export function getAllProductsAlphabetical(): Product[] {
  return [...allProducts].sort((a, b) => a.name.localeCompare(b.name, "pl"));
}

export function getAllProductsNewest(): Product[] {
  return [...allProducts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProductsInStock(): Product[] {
  return allProducts.filter((p) => p.amount > 0);
}

export function getProductsOutOfStock(): Product[] {
  return allProducts.filter((p) => p.amount === 0);
}

export function getProductsByCategory(type: ProductType): Product[] {
  return allProducts.filter((p) => p.type === type);
}

export function getProductById(id: number): Product | undefined {
  return allProducts.find((p) => p.id === id);
}
