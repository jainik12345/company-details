// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export const metadata = {
  title: "Company Details",
  description: "Next.js + Tailwind Project",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
