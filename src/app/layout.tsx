"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";

import Providers from "@/providers/Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white  dark:bg-gray-900 text-black dark:text-white">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
