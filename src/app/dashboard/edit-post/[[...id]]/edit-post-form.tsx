"use client";
import React, { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { clientApi } from "@/trpc/react";
import { type serverApi } from "@/trpc/server";

import { postSchema } from "@/server/schemas/post-schemas";
import { Separator } from "@/components/ui/separator";
import MDEditor from "@uiw/react-md-editor";

const EditPostForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id")!;
  const { data, isLoading } = clientApi.post.getPostById.useQuery({
    id: id,
  });
  const [userRole, setUserRole] = useState<string>("ADMIN"); // Exemplu de rol al utilizatorului

  const [editorContent, setEditorContent] = useState(data?.content);

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

  console.log("🚀 ~ data:", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!id) {
    router.push("/dashboard");
  }
  console.log(data);

  const onSubmit = (data: z.infer<typeof postSchema>) => {
    console.log(data);
    // Logica pentru salvarea postării
    // fetch(`/api/posts/${postId}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ ...data, editedBy: "currentUserId" }), // Adaugă ID-ul utilizatorului curent
    // })
    //   .then((response) => response.json())
    //   .then(() => {
    //     router.push("/dashboard").catch((err) => console.error(err));
    //   })
    //   .catch((err) => console.error(err));
  };

  const handleApprove = () => {
    // Logica pentru aprobarea postării
    // fetch(`/api/posts/${postId}/approve`, {
    //   method: "POST",
    // })
    //   .then((response) => response.json())
    //   .then(() => {
    //     router.push("/dashboard").catch((err) => console.error(err));
    //   })
    //   .catch((err) => console.error(err));
  };

  const handlePublish = () => {
    // Logica pentru publicarea postării
    // fetch(`/api/posts/${postId}/publish`, {
    //   method: "POST",
    // })
    //   .then((response) => response.json())
    //   .then(() => {
    //     router.push("/dashboard").catch((err) => console.error(err));
    //   })
    //   .catch((err) => console.error(err));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Top Buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Content</h1>
        <div className="space-x-2">
          {userRole === "EDITOR" && (
            <Button onClick={handleApprove}>Approve</Button>
          )}
          {userRole === "ADMIN" && (
            <>
              <Button onClick={handleApprove}>Approve</Button>
              <Button onClick={handlePublish}>Publish</Button>
            </>
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
                  {/* <Textarea
                    placeholder="Write here..."
                    rows={10}
                    {...field}
                    className="p-3 text-base"
                  /> */}
                  <MDEditor
                    id="editor"
                    className="rounded-md border p-2"
                    onChange={(value) => {
                      setEditorContent(value);
                      field.onChange(value);
                    }}
                    value={editorContent}
                    autoCapitalize="none"
                    // data-color-mode="light"
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
