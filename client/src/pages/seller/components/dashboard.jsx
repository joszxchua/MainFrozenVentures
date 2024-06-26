import React from "react";

export const Dashboard = () => {
  return (
    <>
      <h2 className="text-5xl font-bold">Dashboard</h2>

      <div class="grid grid-cols-3 grid-rows-2 gap-10 p-4 items-center text-white">
        <div class="h-full flex flex-col justify-center items-center gap-3 col-span-1 row-span-2 bg-purple-200 rounded-lg">
          <h3 class="text-5xl font-semibold">Today's Sale</h3>
          <p className="text-xl">Php 500.00</p>
        </div>
        <div class="h-32 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Order</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="h-32 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Received</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="h-32 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Delivery</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="h-32 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Refund</h3>
          <p className="text-xl">10</p>
        </div>
      </div>

      <div className="mt-10 flex justify-between gap-10">
        <div className="w-full">
          <h3 className="text-4xl font-bold">Summary</h3>
        </div>
        <div className="w-full">
          <h3 className="text-4xl font-bold">Recent Orders</h3>
        </div>
      </div>
    </>
  );
};
