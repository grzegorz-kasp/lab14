export default function CategoryLayout({
  children,
  products,
}: {
  children: React.ReactNode;
  products: React.ReactNode;
}) {
  return (
    <>
      {products}
      {children}
    </>
  );
}
