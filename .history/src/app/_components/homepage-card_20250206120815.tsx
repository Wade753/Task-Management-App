"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface PostType {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  job: string
}

interface HomepageCardProps {
  data: PostType
  index: number
  color: string
}

const getTextColor = (backgroundColor: string): string => {
  const darkColors = ["bg-blue-500", "bg-purple-500", "bg-indigo-500"]
  return darkColors.includes(backgroundColor) ? "text-white" : "text-black"
}

export default function HomepageCard({ data, index, color }: HomepageCardProps) {
  const router = useRouter()
  const textColor = getTextColor(color)

  return (
    <Card
      className={`rounded-xl shadow mx-auto w-full transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer overflow-hidden ${color} ${textColor}`}
      onClick={() => router.push(`/post?id=${data.id}`)}
    >
      <div className="aspect-[4/3] relative">
        <Image src={data.imageUrl || "/placeholder.jpg"} alt={data.title} layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p className="text-lg font-medium text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">
            {data.content}
          </p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <CardTitle className="text-lg font-bold mb-1">{data.title}</CardTitle>
            <span className="opacity-75">{data.job}</span>
          </div>
          <span>{new Date(data.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

