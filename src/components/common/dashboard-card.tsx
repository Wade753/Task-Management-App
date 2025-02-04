"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientApi } from "@/trpc/react";
import { Textarea } from "@/components/ui/textarea";

//GET ALL POSTS

function DashboardCard() {
  const { data, isLoading } = clientApi.post.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data?.map((card) => (
        <Card key={card.id} className="w-[350px]">
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.content}</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label> {/*USER NAME*/}
                  <Input id="name" placeholder="Name of your project" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Title</Label> {/*Title*/}
                  <Textarea placeholder="Type your message here." />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">DELETE</Button> {/*Delete*/}
            <Button>Edit</Button> {/*EDIT*/}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export { DashboardCard };
