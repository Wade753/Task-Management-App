import React from "react";
import AdminNav from "@/app/_components/admin-navigation";
import CommentsList from "./[[...id]]/commentsList";

const page = () => {
  return (
    <>
      <AdminNav />
      <CommentsList />
    </>
  );
};

export default page;
