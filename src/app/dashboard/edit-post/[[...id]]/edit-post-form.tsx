"use client";
import React, { startTransition, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { clientApi } from "@/trpc/react";
import { postSchema } from "@/server/schemas/post-schemas";
import { Separator } from "@/components/ui/separator";
import MDEditor from "@uiw/react-md-editor";
import { useToast } from "@/hooks/use-toast";
import { DeletePostModal } from "@/app/_components/delete-post";
import { Trash2 } from "lucide-react";

const canApprove = (role: string) => role === "WRITER" || role === "ADMIN";
const canPublish = (role: string) => role === "ADMIN";
const canDelete = (role: string) => role === "WRITER" || role === "ADMIN";

const EditPostForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id")!;
  const { data, isLoading } = clientApi.post.getPostById.useQuery({
    id: id,
  });
  const [userRole, setUserRole] = useState<string>("ADMIN");

  const [editorContent, setEditorContent] = useState(data?.content);

  const updatePost = clientApi.post.updatePost.useMutation({
    onSuccess: () => {
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully",
        variant: "success",
      });
    },
  });
  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    console.log(data);
    startTransition(async () => {
      await updatePost.mutateAsync(data);
    });
  };

  const approvePost = clientApi.post.approvePost.useMutation({
    onSuccess: () => {
      toast({
        title: "Post approved",
        description: "Your post has been approved successfully",
        variant: "success",
      });
    },
  });
  const handleApprove = async () => {
    if (!canApprove(userRole)) {
      throw new Error("Unauthorized");
    }
    try {
      await approvePost.mutateAsync({ id: id });
    } catch (error) {
      console.error(error);
    }
  };

  const publishPost = clientApi.post.publishPost.useMutation({
    onSuccess: () => {
      toast({
        title: "Post published",
        description: "Your post has been published successfully",
        variant: "success",
      });
    },
  });
  const handlePublish = async () => {
    if (!canPublish(userRole)) {
      throw new Error("Unauthorized");
    }
    try {
      await publishPost.mutateAsync({ id: id });
    } catch (error) {
      console.error(error);
    }
  };
  const deletePost = clientApi.post.deletePost.useMutation({
    onSuccess: () => {
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully",
        variant: "success",
      });
      router.push("/dashboard");
    },
  });
  const handleDelete = async () => {
    if (!canDelete(userRole)) {
      throw new Error("Unauthorized");
    }
    try {
      await deletePost.mutateAsync({ id: id });
    } catch (error) {
      console.error(error);
    }
  };

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: data?.title ?? "",
      content: data?.content ?? "",
      id: data?.id ?? "",
      published: data?.published ?? false,
      createdAt: data?.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data?.updatedAt ? new Date(data.updatedAt) : new Date(),
      approvedById: data?.approvedById ?? null,
      editedById: data?.editedById ?? null,
      createdById: data?.createdById ?? "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        content: data.content,
        id: data.id,
        published: data.published,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        approvedById: data.approvedById,
        editedById: data.editedById,
        createdById: data.createdById,
      });
      setEditorContent(data.content);
    }
  }, [data, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!id) {
    router.push("/dashboard");
  }
  console.log(form.formState.errors, form.formState);
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Top Buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Content</h1>
        <div className="space-x-2">
          {canApprove(userRole) && (
            <Button onClick={handleApprove}>Approve</Button>
          )}
          {canPublish(userRole) && (
            <Button onClick={handlePublish}>Publish</Button>
          )}
          {canDelete(userRole) && (
            <DeletePostModal
              postTitle={data?.title ?? ""}
              onDelete={handleDelete}
            >
              <Button variant="destructive">
                <Trash2 size={16} className="mr-1" /> Delete
              </Button>
            </DeletePostModal>
          )}
        </div>
      </div>

      <Separator />

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    className="p-2 text-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold">Content</FormLabel>
                <FormControl>
                  <MDEditor
                    id="editor"
                    className="rounded-md border p-2"
                    onChange={(value) => {
                      setEditorContent(value);
                      field.onChange(value);
                    }}
                    value={editorContent}
                    autoCapitalize="none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!!data?.editedById && (
            <p className="text-sm text-gray-500">
              Edited by: {data.editedBy?.name}
            </p>
          )}

          <Separator />

          {/* Bottom Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export { EditPostForm };
