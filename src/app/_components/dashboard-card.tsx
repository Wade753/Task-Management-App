"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { clientApi } from "@/trpc/react";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
//SELECTOR IMPORTS
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type serverApi } from "@/trpc/server";

//GET ALL POSTS

function DashboardCard({
  initialData,
}: {
  initialData: Awaited<ReturnType<(typeof serverApi)["post"]["getAll"]>>;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = clientApi.post.getAll.useQuery(
    undefined,
    {
      initialData,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((card) => (
        <Card key={card.id} className="w-full">
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>

          <CardFooter className="flex justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">
                  <Ellipsis />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[180px]">
                <div className="flex flex-col space-y-1.5">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(`/dashboard/edit-post?id=${card.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button variant="ghost">Delete</Button>
                  <Button variant="ghost">Approve</Button>
                  <Button variant="ghost">Publish</Button>
                  <Button variant="ghost">Comments</Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export { DashboardCard };
