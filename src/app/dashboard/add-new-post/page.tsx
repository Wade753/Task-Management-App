"use client";

//TextEditor
import { Input } from "@/components/ui/input";
import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

//Calendar
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

//USER TYPE
import { type User } from "next-auth";
import { clientApi } from "@/trpc/react";

type FormData = {
  id: string;
  title: string;
  content: string;
  published: true;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
};

export default function AddNewPost() {
  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      //CHANGE IN BACKEND THE DATE INPUT
      createdAt: new Date().toISOString(),
    },
  });

  const [editorContent, setEditorContent] = React.useState("");
  const [date, setDate] = React.useState<Date>();

  //CREATE POST
  const createPost = clientApi.post.create.useMutation();

  //SUBMIT DATA
  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);

    createPost.mutate(
      { content: data.content, title: data.title },
      {
        onSuccess: () => console.log("Success"),
        onError: () => console.log("Error"),
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="mx-auto mt-10 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center">
              Create your post
              <br />
              <Input type="text" placeholder="Name" />
              <br />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <br />
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          field.onChange(selectedDate);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <MDEditor
                      id="editor"
                      className="rounded-md border p-2"
                      onChange={(value) => {
                        setEditorContent(value ?? "");
                        field.onChange(value);
                      }}
                      value={editorContent}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
