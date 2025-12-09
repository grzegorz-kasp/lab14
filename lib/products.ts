import fs from "fs";
import path from "path";

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

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

function loadProducts(): Product[] {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(raw) as Product[];
}

function saveProducts(products: Product[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), "utf8");
}

export function getAllProductsAlphabetical(): Product[] {
  return loadProducts().slice().sort((a, b) => a.name.localeCompare(b.name, "pl"));
}

export function getAllProductsNewest(): Product[] {
  return loadProducts()
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProductsInStock(): Product[] {
  return loadProducts().filter((p) => p.amount > 0);
}

export function getProductsOutOfStock(): Product[] {
  return loadProducts().filter((p) => p.amount === 0);
}

export function getProductsByCategory(type: ProductType): Product[] {
  return loadProducts().filter((p) => p.type === type);
}

export function getProductById(id: number): Product | undefined {
  return loadProducts().find((p) => p.id === id);
}

/**
 * Set product amount for a given id. Returns the updated product or undefined if not found.
 */
export function setProductAmount(id: number, newAmount: number): Product | undefined {
  const products = loadProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx].amount = newAmount;
  saveProducts(products);
  return products[idx];
}

/**
 * Change product amount by delta (can be negative). Returns updated product or undefined.
 */
export function changeProductAmountById(id: number, delta: number): Product | undefined {
  const products = loadProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx].amount = Math.max(0, products[idx].amount + delta);
  saveProducts(products);
  return products[idx];
}

export default {
  getAllProductsAlphabetical,
  getAllProductsNewest,
  getProductsInStock,
  getProductsOutOfStock,
  getProductsByCategory,
  getProductById,
  setProductAmount,
  changeProductAmountById,
};
