import React from "react";
import { DashboardCard } from "@/app/_components/dashboard-card";
import { serverApi } from "@/trpc/server";

const Dashboard = async () => {
  const initialData = await serverApi.post.getAll();

  return (
    <div className="container mx-auto p-6">
<<<<<<< HEAD
      <DashboardCard />
=======
      <h1 className="mb-8 text-center text-4xl font-extrabold">
        AICI POATE SA VINA NAVBAR
      </h1>

      <DashboardCard initialData={initialData} />
>>>>>>> c87dc35f7b407f845dfd1c068c34af0f7d02e377
    </div>
  );
};

export default Dashboard;
