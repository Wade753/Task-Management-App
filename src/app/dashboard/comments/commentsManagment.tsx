"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { clientApi } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react"; // Icon for button
import { type serverApi } from "@/trpc/server";

function CommentManagement({
  initialData,
}: {
  initialData: Awaited<ReturnType<(typeof serverApi)["post"]["getAll"]>>;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = clientApi.post.getAll.useQuery(
    undefined,
    {
      initialData,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data || data.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-semibold">Comments Management</h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.map((card) => (
          <Card key={card.id} className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-end p-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/commetsView?id=${card.id}`)}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CommentManagement;
