import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/public/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-semibold">Kind of Wordpress Clone</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-sm font-medium hover:text-primary">
                Product
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-primary">
                Explore
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-primary">
                Resources
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-primary">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" className="hidden md:inline-flex">
              Log in
            </Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </header>
      <main>
        <section className="container px-4 py-24 md:px-6 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Independent technology
              <span className="block text-muted-foreground">for modern publishing.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Turn your audience into a business. Start publishing, grow your audience, and generate revenue from your
              content.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg">Start your blog</Button>
              <Button size="lg" variant="outline">
                View features
              </Button>
            </div>
          </div>
          <div className="mt-16 rounded-lg border bg-card p-2">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Dashboard preview"
              width={1200}
              height={600}
              className="rounded-md"
              priority
            />
          </div>
        </section>
      </main>
    </div>
  )
}

