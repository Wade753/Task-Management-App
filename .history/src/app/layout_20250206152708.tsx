import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "./_components/navigation"
import { Footer } from "./_components/footer"
import { TRPCReactProvider } from "@/trpc/react"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kind of Wordpress Clone",
  description: " A kind of Wordpress clone built with Next.js ",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        <main>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </main>
        <Footer />
      </body>
    </html>
  )
}

