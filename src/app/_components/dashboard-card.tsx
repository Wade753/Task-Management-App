"use client";

import React from "react";
import { DeletePostModal } from "@/app/_components/delete-post";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { clientApi } from "@/trpc/react";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
//SELECTOR IMPORTS
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type serverApi } from "@/trpc/server";

//GET ALL POSTS

function DashboardCard() {
  const { data, isLoading, isError, refetch } =
    clientApi.post.getAll.useQuery();
  // delete post
  const deletePost = clientApi.post.deletePost.useMutation();
  // update status of post to published or not
  const publishPost = clientApi.post.publishPost.useMutation();
  // const unpublishPost = clientApi.post.unpublishPost.useMutation();
  //approved post BY: name
  const approvePost = clientApi.post.approvePost.useMutation();

  const router = useRouter();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const handleDelete = async (postId: string) => {
    try {
      await deletePost.mutateAsync({ id: postId });
      await refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePublishToggle = async (postId: string, published: boolean) => {
    try {
      if (published) {
        // await unpublishPost.mutateAsync({ id: postId });
      } else {
        await publishPost.mutateAsync({ id: postId });
      }
      await refetch();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const handleApprove = async (postId: string) => {
    try {
      await approvePost.mutateAsync({ id: postId });
      await refetch();
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((card) => (
        <Card
          key={card.id}
          className={`w-full ${
            card.published ? "bg-green-200" : "bg-yellow-200"
          }`}
        >
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>

          <CardFooter className="flex justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  <Ellipsis />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[180px]">
                <div className="flex flex-col space-y-1.5">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(`/dashboard/edit-post?id=${card.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <DeletePostModal
                    postTitle={card.title}
                    onDelete={() => handleDelete(card.id)}
                  >
                    <Button variant="ghost">Delete</Button>
                  </DeletePostModal>
                  <Button
                    variant="ghost"
                    onClick={() => handleApprove(card.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handlePublishToggle(card.id, card.published)}
                  >
                    {card.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(`/dashboard/comment?id=${card.id}`)
                    }
                  >
                    Comment
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {card.approvedBy && (
              <div className="text-xs text-black">
                Approved By: {card.approvedBy.name} ({card.approvedBy.email})
              </div>
            )}
            {card.editedBy && (
              <div className="text-xs text-black">
                Edited By: {card.editedBy.name} ({card.editedBy.email})
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export { DashboardCard };
