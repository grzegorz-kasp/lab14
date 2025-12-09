export default function ProductListLayout({
  children,
  products,
  discounts,
}: {
  children: React.ReactNode;
  products: React.ReactNode;
  discounts: React.ReactNode;
}) {
  return (
    <div className="min-h-screen py-8 px-4">
      {/* Slot Promocje - zawsze widoczny */}
      {discounts}
      
      {/* Slot Produkty */}
      {products}
      
      {/* Children - domyślny slot */}
      {children}
    </div>
  );
}
