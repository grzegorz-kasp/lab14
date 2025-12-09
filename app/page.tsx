import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center justify-center py-16 px-4">
        <Image
          className="mb-8"
          src="/politechnika-krakowska-logo.svg"
          alt="logo politechniki krakowskiej"
          width={100}
          height={100}
          priority
        />
        <div className="text-xl text-center">
          Witajcie na stronie sklepu komputerowego 2025GK!
        </div>
      </main>
    </div>
  );
}
