import React from "react";
import logo from "/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

export const Dashboard = () => {
  return (
    <>
      <div className="flex gap-3 text-5xl font-bold">
        <FontAwesomeIcon icon={faChartLine} />
        <h2>Dashboard</h2>
      </div>

      <div class="mt-10 grid grid-cols-3 grid-rows-2 gap-10 p-4 items-center text-white">
        <div class="py-5 h-full flex flex-col justify-center items-center gap-3 col-span-1 row-span-2 bg-purple-200 rounded-lg">
          <h3 class="text-center text-5xl font-semibold">Today's Sale</h3>
          <p className="text-xl">Php 500.00</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Order</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Received</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Delivery</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Refund</h3>
          <p className="text-xl">10</p>
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <div className="w-full px-5">
          <h3 className="text-4xl font-bold">Summary</h3>
        </div>

        <div className="w-full px-5">
          <h3 className="text-4xl font-bold pb-5 mb-5 border-b-2">
            Recent Orders
          </h3>

          <div className="flex items-center gap-3 pb-5 mb-5">
            <img src={logo} alt="" className="w-16 h-16" />
            <div className="w-full">
              <p className="text-xl font-bold">Pedro Mapagmahal</p>

              <div className="flex justify-between text-sm">
                <div className="text-gray-200">
                  <p>Ice cream masarap</p>
                  <p>Matcha 1Gallon 2x</p>
                </div>

                <div>
                  <p>
                    <span className="font-bold">Total Price:</span> Php 500.00
                  </p>
                  <p>
                    <span className="font-bold">Order Date:</span> June 28, 2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-5 mb-5">
            <img src={logo} alt="" className="w-16 h-16" />
            <div className="w-full">
              <p className="text-xl font-bold">Pedro Mapagmahal</p>

              <div className="flex justify-between text-sm">
                <div className="text-gray-200">
                  <p>Ice cream masarap</p>
                  <p>Matcha 1Gallon 2x</p>
                </div>

                <div>
                  <p>
                    <span className="font-bold">Total Price:</span> Php 500.00
                  </p>
                  <p>
                    <span className="font-bold">Order Date:</span> June 28, 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
