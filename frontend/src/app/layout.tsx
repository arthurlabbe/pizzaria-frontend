import type { Metadata } from "next";
import "./globals.scss";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BellaForneria - A melhor pizzaria",
  description: "A melhor pizzaria do Nordeste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              backgroundColor: "#f1f1f1",
              color: "#131313",
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
