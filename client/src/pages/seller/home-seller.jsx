import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faIceCream,
  faCubes,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

export const HomeSeller = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleDashboardClick = () => {
    setActiveTab("dashboard");
  };

  const handleMyProductsClick = () => {
    setActiveTab("myProducts");
  };

  const handleMyInventoryClick = () => {
    setActiveTab("myInventory");
  };

  const handleInboxClick = () => {
    setActiveTab("inbox");
  };

  return (
    <div className="mt-20 grid grid-cols-[25%_75%] font-inter">
      <div className="h-[75vh] p-5">
        <div className="h-full rounded-lg bg-gray-100 p-8">
          <div>
            <h2 className="text-4xl font-bold">Menu</h2>
            <p className="text-lg text-gray-200">
              Manage your products, inventory, and inbox
            </p>
          </div>

          <ul className="flex flex-col gap-4 pt-10 font-bold text-2xl">
            <li
              onClick={handleDashboardClick}
              className={`${
                activeTab === "dashboard" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-3" />
              Dashboard
            </li>
            <li
              onClick={handleMyProductsClick}
              className={`${
                activeTab === "myProducts" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faIceCream} className="mr-3" />
              My Products
            </li>
            <li
              onClick={handleMyInventoryClick}
              className={`${
                activeTab === "myInventory"
                  ? "text-purple-200"
                  : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faCubes} className="mr-3" />
              My Inventory
            </li>
            <li
              onClick={handleInboxClick}
              className={`${
                activeTab === "inbox" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faComment} className="mr-3" />
              Inbox
            </li>
          </ul>
        </div>
      </div>

      <div className="p-5"></div>
    </div>
  );
};
