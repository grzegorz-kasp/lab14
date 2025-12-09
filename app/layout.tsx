import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Merriweather } from "next/font/google";
import "./global.css";
import MainHeader from "./components/mainheader";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sklep komputerowy 2025GK",
  description: "Sklep komputerowy stworzony przez Grzegorza Kasprzaka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${merriweather.variable}`} 
        style={{ fontFamily: 'var(--font-merriweather), serif' }}
      >
        <MainHeader />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
