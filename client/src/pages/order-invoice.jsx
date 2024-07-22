import React, { useState, useEffect } from "react";
import axios from "axios";
import van from "../assets/van.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const capitalizeFirstChar = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const OrderInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceData } = location.state || {};
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (invoiceData.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/account/accountFetch",
            {
              accountId: invoiceData.accountId,
            }
          );
          if (response.data.status === 1) {
            const userData = response.data.account;

            setUserInfo(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [invoiceData.accountId]);

  const handlePurchaseHistoryClick = () => {
    navigate("/purchase-history");
  };

  const handleGoToShopClick = () => {
    navigate("/shop");
  };

  return (
    <div className="h-screen flex items-center justify-center pt-[100px] font-inter">
      <div className="relative w-[30%] m-auto bg-gray-100 px-10 pt-52 pb-10 rounded-lg">
        <img
          src={van}
          alt="Delivery"
          className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-[450px]"
        />

        <p className="flex justify-between text-xl font-semibold border-b pb-5">
          <span>Customer Name</span>
          {capitalizeFirstChar(userInfo.firstName)}{" "}
          {capitalizeFirstChar(userInfo.lastName)}
        </p>

        <div className="flex flex-col items-center justify-center gap-2 my-10">
          <h3 className="font-bold text-3xl">
            Thank you, {userInfo.firstName}!
          </h3>
          <p className="text-lg">Your order is being prepared</p>
        </div>

        <div className="my-2">
          <p className="flex justify-between text-lg font-medium">
            <span className="text-gray-200">Order Date</span>
            {formatDate(invoiceData.orderDate)}
          </p>
          <p className="flex justify-between text-lg font-medium">
            <span className="text-gray-200">Receive Date</span>
            {formatDate(invoiceData.receiveDate)}
          </p>
        </div>

        <div className="my-2">
          <p className="flex justify-between text-lg font-medium">
            <span className="text-gray-200">Shipping Method</span>
            {invoiceData.shippingMode}
          </p>
          <p className="flex justify-between text-lg font-semibold">
            <span className="text-gray-200">Total Cost</span>Php{" "}
            {invoiceData.totalCost.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between text-xl text-purple-200 font-semibold mt-8">
          <p
            onClick={handlePurchaseHistoryClick}
            className="w-full cursor-pointer"
          >
            Purchase History
          </p>
          <FontAwesomeIcon icon={faHeart} className="w-full" />
          <p
            onClick={handleGoToShopClick}
            className="w-full text-right cursor-pointer"
          >
            Go To Shop
          </p>
        </div>
      </div>
    </div>
  );
};
