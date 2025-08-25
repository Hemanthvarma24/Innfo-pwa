import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Innfo - PG Accommodation",
  description: "Find your perfect PG accommodation with Innfo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col">
          <main>
            <Suspense>
              {children}
            </Suspense>
            </main>
        </div>
      </body>
    </html>
  );
}
