"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow, set } from "date-fns";
import { clientApi } from "@/trpc/react";
import { z, ZodNull } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

type Comment = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  postId: string;
  likes: number;
};
const commentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(1, { message: "Comment must be at least 1 characters" }),
  postId: z.string().uuid(),
});
const CommentsSection = ({ postId }: { postId: string }) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      postId: postId,
    },
  });
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const { data: fetchedComments, refetch } =
    clientApi.comment.getApproved.useQuery({ postId });

  useEffect(() => {
    const storedName = localStorage.getItem("commentName");
    const storedEmail = localStorage.getItem("commentEmail");
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (fetchedComments) {
      setComments(
        fetchedComments.map((comment) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
        })),
      );
    }
  }, [fetchedComments]);

  useEffect(() => {
    if (dialogOpen && replyTo && message.trim() === "") {
      setMessage(`@${replyTo.name} `);
    }
  }, [dialogOpen, replyTo, message]); // Am adăugat 'message' în dependențe

  const createComment = clientApi.comment.create.useMutation({
    onSuccess: () => {
      localStorage.setItem("commentName", name);
      localStorage.setItem("commentEmail", email);

      setMessage("");
      setErrors({});
      setDialogOpen(false);
      setReplyTo(null);
      toast({
        title: "Success",
        description: "Comment submitted successfully for approval!",
        variant: "default",
      });
      void refetch(); // Marcat cu 'void' pentru a ignora promisiunea returnată
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your comment.",
        variant: "destructive",
      });
    },
  });

  const increaseLikes = clientApi.comment.incraseLikes.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      console.error("Error increasing likes:", error);
      toast({
        title: "Error",
        description: "An error occurred while increasing likes.",
        variant: "destructive",
      });
    },
  });

  const decreaseLikes = clientApi.comment.decreaseLikes.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      console.error("Error decreasing likes:", error);
      toast({
        title: "Error",
        description: "An error occurred while decreasing likes.",
        variant: "destructive",
      });
    },
  });

  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const handleLike = (id: string) => {
    if (activeCommentId !== id) {
      increaseLikes.mutate({ id });
      setActiveCommentId(id);
    } else {
      decreaseLikes.mutate({ id });
      setActiveCommentId(null);
    }
  };

  const handleSubmit = (data: z.infer<typeof commentSchema>) => {
    createComment.mutate(data);
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <Card className="h-[360px] overflow-y-auto rounded-lg border border-gray-200 p-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">
            Be the first to leave a comment!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 border-b p-2 text-sm"
              >
                <div className="flex w-20 flex-col items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{comment.name[0]}</AvatarFallback>
                  </Avatar>
                  <p className="mt-1 text-center text-xs font-bold">
                    {comment.name}
                  </p>
                  <p className="text-center text-[10px] text-gray-500">
                    {comment.email}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="max-h-24 w-full overflow-y-auto rounded-lg border bg-gray-100 p-2 text-xs">
                    {comment.message}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <p>
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment.id)}
                      >
                        {/*INCREASE LIKE COUNT*/}
                        <Heart
                          className={`h-4 w-4 ${
                            activeCommentId === comment.id
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        />
                        <span>{comment.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyTo(comment);
                          setDialogOpen(true);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Button
        className="w-full text-sm"
        onClick={() => {
          setReplyTo(null);
          setDialogOpen(true);
        }}
      >
        Add Comment
      </Button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setReplyTo(null);
          setDialogOpen(open);
        }}
      >
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>
              {replyTo ? "Reply to Comment" : "Add a Comment"}
            </DialogTitle>
          </DialogHeader>
          <div id="dialog-description" className="sr-only">
            Fill out the form to{" "}
            {replyTo ? "reply to the comment" : "add your comment"}.
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*ATTACH REPLAY TO ORIGINAL COMMENT*/}
              {replyTo && (
                <p className="mb-2 text-sm">
                  Replying to <strong>{replyTo.name}</strong>
                  <Button
                    variant="link"
                    className="ml-2 text-xs"
                    onClick={() => setReplyTo(null)}
                  >
                    Cancel Reply
                  </Button>
                </p>
              )}

              <FormField
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your comment</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your comment..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createComment.isPending}>
                  {createComment.isPending ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentsSection;
