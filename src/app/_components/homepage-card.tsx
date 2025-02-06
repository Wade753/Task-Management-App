"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { type extendedPostType } from "@/server/schemas/post-schemas";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function truncateText(text: string, maxLength = 150): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}
function isPlainText(text: string): boolean {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div.innerText === text;
}
export default function HomepageCard({
  title,
  content,
  id,
  createdBy,
  createdAt,
}: extendedPostType) {
  const router = useRouter();
  const truncatedContent = truncateText(content);
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Card
      className="mx-auto w-full max-w-md cursor-pointer rounded-xl border shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
      onClick={() => router.push(`/post?id=${id}`)}
    >
      <CardContent className="p-4">
        {/* Titlu centrat */}
        <CardTitle className="mb-3 text-center text-xl font-bold">
          {title}
        </CardTitle>

        {/* Conținutul central */}
        {content &&
          truncatedContent &&
          (isPlainText(truncatedContent) ? (
            <div className="text-md text-center text-gray-700">
              {truncatedContent}
            </div>
          ) : (
            <div
              className="text-md text-center text-gray-700"
              dangerouslySetInnerHTML={{ __html: truncatedContent }}
              suppressContentEditableWarning
              suppressHydrationWarning
            />
          ))}

        {/* Footer cu autorul și data */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>
                {createdAt?.toString().charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{createdBy.name}</span>
          </div>
          <span>{timeAgo}</span>
        </div>
      </CardContent>
    </Card>
  );
}
