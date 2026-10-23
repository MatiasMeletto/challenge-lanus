import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GranaBank - Club Lanús",
  description: "Challenge Técnico Frontend - Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}