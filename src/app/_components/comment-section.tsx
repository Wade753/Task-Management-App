"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clientApi } from "@/trpc/react";

const commentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(5, "Comment must be at least 5 characters."),
  approved: z.boolean().optional(),
  createdAt: z.date().optional(),
  postId: z.string().uuid(),
});

export default function CommentSection() {
  const [user, setUser] = useState({ name: "", email: "", role: "GUEST" });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "",
      email: "",
      comment: "",
      postId: "1",
    },
  });

  useEffect(() => {
    if (user.email.includes("admin@")) {
      setUser((prev) => ({ ...prev, role: "ADMIN" }));
    } else if (user.email.includes("editor@")) {
      setUser((prev) => ({ ...prev, role: "EDITOR" }));
    } else {
      setUser((prev) => ({ ...prev, role: "WRITER" }));
    }
  }, [user.email]);

  const createCommentMutation = clientApi.comment.create.useMutation();

  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    try {
      await createCommentMutation.mutateAsync({
        name: values.name,
        email: values.email,
        message: values.comment,
        id: values.postId,
      });
      form.reset();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div className="p-4">
      <Card className="mb-4 p-4">
        <h2 className="mb-2 text-xl font-semibold">Login</h2>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <p className="mt-2 text-gray-500">Logged in as: {user.role}</p>
      </Card>

      {user.role === "WRITER" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Add Comment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
