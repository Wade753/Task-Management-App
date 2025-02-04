import HomePageCard from "@/app/_components/homepage-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
import HomepagePosts from "./_components/homepage-posts";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative pb-16 pt-32">
        <div
          className="absolute inset-0 mt-16 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("blog.jpg")',
            backgroundSize: "110%",
          }}
        />
        <div className="absolute inset-0 mt-16 bg-black/50" />
        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
                Welcome to our blog library
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-gray-100">
                The professional publishing platform for creators and
                businesses. Start your blog, share your ideas, and grow your
                audience.
              </p>
            </div>
            <div className="mt-8">
              <Button
                size="lg"
                variant="default"
                className="bg-white text-black hover:bg-gray-100"
              >
                Start your blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <HomepagePosts />
    </div>
  );
}
