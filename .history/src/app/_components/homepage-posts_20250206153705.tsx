// import HomepageCard from "@/app/_components/homepage-card";
// import { serverApi } from "@/trpc/server";

// import React from "react";

// const HomepagePosts = async () => {
//   const data = await serverApi.post.getAll(); 
// aici m-am incurcat



import HomepageCard from "./homepage-card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const developerJokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "Why do Java developers wear glasses? Because they don't C#!",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "Why did the developer go broke? Because he used up all his cache.",
  "Why did the programmer quit his job? Because he didn't get arrays.",
  "What's a programmer's favorite hangout place? Foo Bar.",
]

const cardData = [
  { title: "ToDy95", color: "bg-blue-500", job: "Frontend Developer" },
  { title: "BiancaTuna", color: "bg-green-500", job: "Frontend Developer" },
  { title: "MedaToma", color: "bg-yellow-500", job: "Frontend Developer" },
  { title: "SimonaGhior", color: "bg-purple-500", job: "Frontend Developer" },
  { title: "Cipster93", color: "bg-red-500", job: "Frontend Developer" },
  { title: "RobertBalu", color: "bg-indigo-500", job: "Frontend Developer" },
  { title: "WageGG", color: "bg-pink-500", job: "Frontend Developer" },
]

const HomepagePosts = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">FEATURED</h2>
            <Link href="/all" className="text-sm text-pink-500 hover:text-pink-600">
              ALL
            </Link>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cardData.map((card, index) => (
            <HomepageCard
              key={card.title}
              data={{
                id: `${index}`,
                title: card.title,
                content: developerJokes[index % developerJokes.length],
                author: "Developer",
                createdAt: new Date().toISOString(),
                job: card.job,
              }}
              index={index}
              color={card.color}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomepagePosts

