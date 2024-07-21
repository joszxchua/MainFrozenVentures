import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

export const Dashboard = () => {
  return (
    <>
      <div className="flex gap-3 text-4xl font-bold">
        <FontAwesomeIcon icon={faChartLine} />
        <h2>Dashboard</h2>
      </div>

      <div class="mt-10 grid grid-cols-3 grid-rows-2 gap-10 p-4 items-center text-white">
        <div class="py-5 h-full flex flex-col justify-center items-center gap-3 col-span-1 row-span-2 bg-purple-200 rounded-lg">
          <h3 class="text-center text-5xl font-semibold">Total Reports</h3>
          <p className="text-xl">500</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Total Customers</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Total Retailers</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Total Distributors</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Total Manufacturers</h3>
          <p className="text-xl">10</p>
        </div>
      </div>
    </>
  );
};
