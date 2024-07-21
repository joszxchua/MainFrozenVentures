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

      <div className="min-h-[70vh] max-h-[70vh]">
        <div class="mt-10 flex justify-between gap-10 p-4 items-center text-white">
          <div class="w-full py-5 flex flex-col justify-center items-center gap-3 bg-purple-200 rounded-lg">
            <h3 class="text-3xl font-semibold">Orders</h3>
            <p className="text-xl">10</p>
          </div>
          <div class="w-full py-5 flex flex-col justify-center items-center gap-3 bg-purple-200 rounded-lg">
            <h3 class="text-3xl font-semibold">Received</h3>
            <p className="text-xl">10</p>
          </div>
          <div class="w-full py-5 flex flex-col justify-center items-center gap-3  bg-purple-200 rounded-lg">
            <h3 class="text-3xl font-semibold">Deliveries</h3>
            <p className="text-xl">10</p>
          </div>
        </div>
      </div>
    </>
  );
};
