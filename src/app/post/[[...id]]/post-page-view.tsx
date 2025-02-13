"use client";
import React from "react";
import CommentSection from "@/app/_components/comment-section";
import { clientApi } from "@/trpc/react";
import { type serverApi } from "@/trpc/server";
import { useRouter, useSearchParams } from "next/navigation";

const PostPageViewContent = () => {
  const router = useRouter();
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
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-4 text-3xl font-bold">{data.title}</h1>
          <div className="mb-4 text-gray-600">
            <span>
              Published: {new Date(data.createdAt).toLocaleDateString()}
            </span>
            {data.updatedAt && (
              <span className="ml-4">
                Updated: {new Date(data.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div
            className="mb-6 text-gray-800"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
          <div className="text-gray-600">
            <span>Created by: {data.createdBy.name}</span>
            {data.editedBy && (
              <span className="ml-4">Edited by: {data.editedBy.name}</span>
            )}
            {data.approvedBy && (
              <span className="ml-4">Approved by: {data.approvedBy.name}</span>
            )}
          </div>
        </div>
      </div>

      <CommentSection postId={id} />
    </>
  );
};

const PostPageView = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <PostPageViewContent />
    </React.Suspense>
  );
};
export default PostPageView;
