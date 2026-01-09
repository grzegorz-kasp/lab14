export default function ProductDetailLayout({
  children,
  modal,
  products,
  discounts,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  products: React.ReactNode;
  discounts: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
