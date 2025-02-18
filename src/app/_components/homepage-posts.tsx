import HomepageCard from "@/app/_components/homepage-card";
import { serverApi } from "@/trpc/server";

import React from "react";

const a = async () => {
  const data = await serverApi.post.getAll();
  console.log(data);
};

const HomepagePosts = async () => {
  const data = await serverApi.post.getAll();

  return (
    <section className="bg-background py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">FEATURED</h2>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((card, index) => (
            <HomepageCard
              key={index}
              title={card.title}
              content={card.content}
              id={card.id}
              createdBy={card.createdBy}
              createdById={card.createdById}
              updatedAt={card.updatedAt}
              createdAt={card.createdAt}
              published={card.published}
              editedBy={card.editedBy}
              editedById={card.editedById}
              approvedBy={card.approvedBy}
              approvedById={card.approvedById}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepagePosts;
