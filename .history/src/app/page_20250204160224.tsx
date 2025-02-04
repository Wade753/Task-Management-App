import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="pt-32 pb-16 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mt-16"
          style={{
            backgroundImage:
              'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lauren-mancke-aOC7TSLb1o8-unsplash.jpg-KuZzld6SmlFjtq9xEzz6YsPKZbvKD5.jpeg")',
            backgroundSize: "110%", // This makes the background image slightly bigger
          }}
        />
        <div className="absolute inset-0 bg-black/50 mt-16" /> {/* Increased opacity for better text contrast */}
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
                Welcome to our blog library
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-100 text-lg">
                The professional publishing platform for creators and businesses. Start your blog, share your ideas, and
                grow your audience.
              </p>
            </div>
            <div className="mt-8">
              <Button size="lg" variant="default" className="bg-white text-black hover:bg-gray-100">
                Start your blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <Star className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Professional Publishing</h3>
                <p className="text-muted-foreground">Create beautiful posts and pages with our modern editor.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Star className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Built for Scale</h3>
                <p className="text-muted-foreground">Grow your audience with powerful SEO and sharing features.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Star className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Membership Features</h3>
                <p className="text-muted-foreground">Turn your audience into a business with built-in memberships.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

