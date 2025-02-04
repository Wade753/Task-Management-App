"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type postType } from "@/server/schemas/post-schemas";
import { useRouter } from "next/navigation";

export default function HomepageCard({ data }: { data: postType }) {
  const excerpt =
    data.content.length > 300
      ? data.content.substring(0, 300) + "..."
      : data.content;

  const router = useRouter();

  return (
    <Card
      className="mx-auto w-full max-w-md transition-shadow hover:shadow-lg"
      onClick={() => router.push(`/post?id=${data.id}`)}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-semibold">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-gray-600">
        <p>{excerpt}</p>
      </CardContent>
    </Card>
  );
}
