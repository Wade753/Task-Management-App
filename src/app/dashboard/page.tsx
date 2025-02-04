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

//GET ALL POSTS

export function CardWithForm() {
  const { data } = clientApi.post.getAll.useQuery();
  //if (!data) return;
  console.log(data);

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
                  <textarea> {/*Content*/}</textarea>
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

export default CardWithForm;
