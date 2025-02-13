import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "./_components/footer";
import { TRPCReactProvider } from "@/trpc/react";
import type React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navigation } from "./_components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kind of Wordpress Clone",
  description: " A kind of Wordpress clone built with Next.js ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        <main>
          <ThemeProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
