import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vattanac Brewery | Official Website",
  description:
    "Vattanac Brewery - Explore our brewery, products, brands, and latest updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}