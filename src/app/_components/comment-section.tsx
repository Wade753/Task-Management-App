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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { clientApi } from "@/trpc/react";
import { z } from "zod";

const commentCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(5, "Comment must be at least 5 characters."),
  postId: z.string().uuid(),
});

interface Comment {
  id: number | string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

interface CommentsSectionProps {
  postId?: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId = "123e4567-e89b-12d3-a456-426614174000",
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const { data: fetchedComments, refetch } = clientApi.comment.getApproved.useQuery();

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
        }))
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
      alert("Comment submitted successfully for approval!");
      void refetch(); // Marcat cu 'void' pentru a ignora promisiunea returnată
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      alert("Failed to submit the comment. Please try again.");
    },
  });

  const handleSubmit = () => {
    const result = commentCreateSchema.safeParse({ name, email, message, postId });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
      });
      return;
    }
    setErrors({});
    createComment.mutate({ name, email, message, postId });
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <Card className="p-4 h-[360px] overflow-y-auto border border-gray-200 rounded-lg">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">Be the first to leave a comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-4 p-2 border-b text-sm">
                <div className="flex flex-col items-center w-20">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{comment.name[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-bold mt-1 text-center">{comment.name}</p>
                  <p className="text-[10px] text-gray-500 text-center">{comment.email}</p>
                </div>

                <div className="flex-1">
                  <div className="p-2 border rounded-lg max-h-24 overflow-y-auto text-xs bg-gray-100 w-full">
                    {comment.message}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                    <p>
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyTo(comment);
                          setDialogOpen(true);
                        }}
                      >
                        <MessageCircle className="w-4 h-4 text-gray-500" />
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
            <DialogTitle>{replyTo ? "Reply to Comment" : "Add a Comment"}</DialogTitle>
          </DialogHeader>
          <div id="dialog-description" className="sr-only">
            Fill out the form to {replyTo ? "reply to the comment" : "add your comment"}.
          </div>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-2"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          {replyTo && (
            <p className="text-sm mb-2">
              Replying to <strong>{replyTo.name}</strong>
              <Button
                variant="link"
                className="text-xs ml-2"
                onClick={() => setReplyTo(null)}
              >
                Cancel Reply
              </Button>
            </p>
          )}
          <Textarea
            placeholder="Your comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mb-2"
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={createComment.isPending}>
              {createComment.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentsSection;
