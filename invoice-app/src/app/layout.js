import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "MARCO MEN | Premium Men's Accessories",
  description: "Refined essentials. Timeless design. Made for the modern man.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="bg-brand-ivory text-brand-charcoal font-sans antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
