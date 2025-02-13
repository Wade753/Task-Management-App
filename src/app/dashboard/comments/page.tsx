"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  approved: boolean;
  postId: string;
}

const DashboardCommentsPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleApprove = (id: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === id ? { ...comment, approved: true } : comment,
      ),
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== id),
      );
    }
  };

  const filteredComments = comments.filter((comment) => !comment.approved);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-center text-4xl font-extrabold">
        Comments Management
      </h1>
      {filteredComments.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredComments.map((comment) => (
            <Card
              key={comment.id}
              className="transform rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-4 flex items-center space-x-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback>
                    {comment.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{comment.name}</h2>
                  <p className="text-sm text-gray-500">{comment.email}</p>
                </div>
              </div>
              <p className="mb-4 text-gray-700">{comment.message}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleApprove(comment.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No unapproved comments found.
        </p>
      )}
    </div>
  );
};

export default DashboardCommentsPage;
