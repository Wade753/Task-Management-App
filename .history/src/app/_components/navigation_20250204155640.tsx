import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-xl">
            Kind of a Wordpress clone
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/products" className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <Link href="/explore" className="text-muted-foreground hover:text-foreground">
              Explore
            </Link>
            <Link href="/resources" className="text-muted-foreground hover:text-foreground">
              Resources
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Button variant="ghost">Log in</Button>
          <Button>Sign up</Button>
        </div>
      </nav>
    </header>
  )
}

