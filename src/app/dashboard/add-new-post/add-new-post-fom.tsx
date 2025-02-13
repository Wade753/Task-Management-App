"use client";

// TextEditor
import { Input } from "@/components/ui/input";
import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// USER TYPE
import { type User } from "next-auth";
import { clientApi } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  id: string;
  title: string;
  content: string;
  published: true;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
};

function AddNewPostForm() {
  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
    },
  });

  const { toast } = useToast();

  const [editorContent, setEditorContent] = React.useState("");
  const router = useRouter();
  // CREATE POST
  const createPost = clientApi.post.create.useMutation({
    onSuccess: async (data) => {
      console.log(data, "DATA PRIMITA");
      toast({
        title: "Post Created",
        description: "Your post has been created successfully",
        variant: "success",
      });
      setTimeout(() => {
        router.push(`/dashboard/edit-post?id=${data.id}`);
      }, 500);
    },
    onError: () => console.log("Error"),
  });

  // SUBMIT DATA
  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);

    await createPost.mutateAsync(data);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Create Your Post</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the title here"
                      {...field}
                      className="text-xl font-semibold"
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
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div data-color-mode="light">
                      <MDEditor
                        id="editor"
                        className="rounded-md border p-2"
                        onChange={(value) => {
                          setEditorContent(value!);
                          field.onChange(value);
                        }}
                        value={editorContent}
                        autoCapitalize="none"
                        height={500}
                        style={{ backgroundColor: "white" }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="py-3 text-lg">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export { AddNewPostForm };
