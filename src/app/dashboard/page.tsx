import React from "react";
import { DashboardCard } from "@/app/_components/dashboard-card";
import { serverApi } from "@/trpc/server";

const Dashboard = async () => {
  const initialData = await serverApi.post.getAll();

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-center text-4xl font-extrabold">
        AICI POATE SA VINA NAVBAR
      </h1>

      <DashboardCard initialData={initialData} />
    </div>
  );
};

export default Dashboard;
