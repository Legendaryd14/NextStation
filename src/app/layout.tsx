import type { Metadata } from "next";

import "@/styles/globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { AuthProvider } from "@/components/auth/context/AuthProvider.tsx";

export const metadata: Metadata = {
  title: "NextStation",
  description: "NextStation, an E-commerce gaming website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
