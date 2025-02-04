import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
});

const EditPost = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [editedBy, setEditedBy] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("WRITER"); // Exemplu de rol al utilizatorului

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (!postId) {
      router.push("/dashboard").catch((err: unknown) => console.error(err));
    } else {
      // Fetch post data including editedBy
      fetch(`/api/posts/${postId}`)
        .then((response) => response.json())
        .then((data: { title: string; content: string; editedBy: string }) => {
          form.reset({
            title: data.title,
            content: data.content,
          });
          setEditedBy(data.editedBy);
        })
        .catch((err) => console.error(err));
    }
  }, [postId, router, form]);

  const onSubmit = (data: { title: string; content: string }) => {
    // Logica pentru salvarea postării
    fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, editedBy: "currentUserId" }), // Adaugă ID-ul utilizatorului curent
    })
      .then((response) => response.json())
      .then(() => {
        router.push("/dashboard").catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handleApprove = () => {
    // Logica pentru aprobarea postării
    fetch(`/api/posts/${postId}/approve`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        router.push("/dashboard").catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const handlePublish = () => {
    // Logica pentru publicarea postării
    fetch(`/api/posts/${postId}/publish`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        router.push("/dashboard").catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="Content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {editedBy && (
          <div>
            <p>Edited by: {editedBy}</p>
          </div>
        )}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
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
      </form>
    </Form>
  );
};

export default EditPost;
