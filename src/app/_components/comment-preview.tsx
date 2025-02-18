"use client";

import React from "react";
import { clientApi } from "@/trpc/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CommentView = ({ postId }: { postId: string }) => {
  const { data, isLoading, isError } =
    clientApi.comment.getCommentsByPostId.useQuery({ postId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data || data.length === 0) {
    return <div>No comments available</div>;
  }

  return (
    <div className="container mx-auto mt-16 p-6">
      <h1 className="mb-6 text-2xl font-semibold">List of Comments</h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.map((comment) => (
          <Card key={comment.id} className="w-full shadow-lg">
            <CardContent className="p-4">
              <p>{comment.message}</p>
              <p className="text-sm text-gray-500">By: {comment.name}</p>
              <p className="text-sm text-gray-500">Email: {comment.email}</p>
            </CardContent>
            <div className="flex justify-end space-x-2 p-4">
              <Button className="bg-green-500 text-white hover:bg-green-600">
                Approve
              </Button>
              <Button className="bg-red-500 text-white hover:bg-red-600">
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommentView;
