"use client";
import CommentView from "@/app/_components/comment-preview";
import { clientApi } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import React from "react";

const CommentsList = () => {
  const params = useSearchParams();
  const id = params.get("id")!;

  const { data, isLoading } = clientApi.post.getPostById.useQuery({
    id: id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Post not found</div>;
  }

  return (
    <>
      <CommentView postId={id} />
    </>
  );
};

export default CommentsList;
