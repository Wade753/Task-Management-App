import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="pt-32 pb-16 relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-28%20154913-Fo99HCA4jf59xn0IRC8nw7tlv7Nzsz.png")',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-6xl font-bold tracking-tight sm:text-7xl text-white">Welcome to our blog library</h1>
              <p className="mx-auto max-w-[700px] text-white/90 text-xl">
                The professional publishing platform for creators and businesses. Start your blog, share your ideas, and
                grow your audience.
              </p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-md">
                Start your blog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10 rounded-md"
              ></Button>
            </div>
            <div className="pt-4">
              <Link href="/sign-in" className="text-white/90 hover:text-white text-lg">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

