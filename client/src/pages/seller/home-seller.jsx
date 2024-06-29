import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { Dashboard } from "./components/dashboard";
import { MyShop } from "./components/my-shop";
import { MyProducts } from "./components/my-products";
import { MyInventory } from "./components/my-inventory";
import { Inbox } from "./components/inbox";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faShop,
  faIceCream,
  faCubes,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

export const HomeSeller = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [shopData, setShopData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/account/shopFetch",
          {
            accountId: user.accountId,
          }
        );
        if (response.data.status === "success") {
          const accountData = response.data.account;
          setShopData(accountData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.accountId]);

  const handleGoToSettings = () => {
    navigate("/settings");
  };

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
      {shopData?.isVerified === 0 && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center bg-red-100 rounded-lg p-5">
            <h3 className="text-5xl text-red-200 font-bold">
              Verify Your Shop
            </h3>
            <p className="mt-3 text-xl text-red-200 font-semibold">
              Please verify your shop to access the shop menu
            </p>
            <button
              onClick={handleGoToSettings}
              className="mt-5 bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Go to settings
            </button>
          </div>
        </div>
      )}
      <div className="p-5">
        <div className="rounded-lg shadow-2xl p-8">
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
              My Shop
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
        <div className="rounded-lg shadow-2xl p-8">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "myShop" && <MyShop />}
          {activeTab === "myProducts" && <MyProducts />}
          {activeTab === "myInventory" && <MyInventory />}
          {activeTab === "inbox" && <Inbox />}
        </div>
      </div>
    </div>
  );
};
