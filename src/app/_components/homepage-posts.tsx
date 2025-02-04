import HomepageCard from "@/app/_components/homepage-card";
import { serverApi } from "@/trpc/server";

import React from "react";

const HomepagePosts = async () => {
  const data = await serverApi.post.getAll();

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {data.map((post) => (
        <HomepageCard data={post} key={post.id} />
      ))}
    </div>
  );
};

export default HomepagePosts;
