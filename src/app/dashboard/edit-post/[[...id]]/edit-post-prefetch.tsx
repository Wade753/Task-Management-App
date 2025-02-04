import React from "react";
import { serverApi } from "@/trpc/server";
import { EditPostForm } from "./edit-post-form";
import { headers } from "next/headers";

const EditFormIndex = async () => {
  const headersList = await headers();

  const referer = headersList.get("referer");

  const url = referer ? new URL(referer) : new URL("");
  const id = url.searchParams.get("id");
  if (!id) {
    return <div>Error: No ID provided</div>;
  }
  const postData = await serverApi.post.getPostById({ id: id });

  return <EditPostForm postData={postData} />;
};

export default EditFormIndex;
