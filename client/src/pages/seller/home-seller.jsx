import React, { useState } from "react";
import { Dashboard } from "./components/dashboard";
import { MyShop } from "./components/my-shop";
import { MyProducts } from "./components/my-products";
import { MyInventory } from "./components/my-inventory";
import { Inbox } from "./components/inbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faChartLine,
  faShop,
  faIceCream,
  faCubes,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

export const HomeSeller = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleDashboardClick = () => {
    setActiveTab("dashboard");
  };

  const handleMyShopClick = () => {
    setActiveTab("myShop");
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
      <div className="relative h-[90vh] p-5">
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          className="absolute right-0 top-[50%] translate-y-[-50%] text-4xl"
        />
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          className="absolute right-0 top-[50%] translate-y-[-50%] text-4xl"
        />
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
              onClick={handleMyShopClick}
              className={`${
                activeTab === "myShop" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faShop} className="mr-3" />
              My Shopp
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

      <div className="p-5">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "myShop" && <MyShop />}
        {activeTab === "myProducts" && <MyProducts />}
        {activeTab === "myInventory" && <MyInventory />}
        {activeTab === "inbox" && <Inbox />}
      </div>
    </div>
  );
};
