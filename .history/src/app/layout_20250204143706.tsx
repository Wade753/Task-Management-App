import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { cn } from "@/lib/utils"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kind of Wordpress Clone",
  description: "A modern publishing platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground antialiased")}>{children}</body>
    </html>
  )
}

