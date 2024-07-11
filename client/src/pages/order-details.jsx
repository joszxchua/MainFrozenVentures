import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruckFast,
  faLocationDot,
  faBarsProgress,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const OrderDetails = () => {
  const { user } = useContext(UserContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (orderId) {
        try {
          const orderResponse = await axios.post(
            "http://localhost:8081/order/fetchSingleOrder",
            { accountId: user.accountId, orderId: orderId }
          );
          if (orderResponse.data.status === "success") {
            setOrder(orderResponse.data.order);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [orderId]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Received":
        return {
          background: "#ADFF97",
          color: "#239205",
        };
      case "Cancelled":
        return {
          background: "#FF9797",
          color: "#B00D0D",
        };
      case "Pending":
        return {
          background: "#D1D5DB",
          color: "#737373",
        };
      default:
        return {};
    }
  };

  return (
    <div className="mt-20 px-10 pb-10 font-inter">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold">Order Details</h1>
        <button className="bg-red-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-red-200 hover:bg-white hover:text-red-200 duration-300 ease-in-out">
          Cancel Order
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="p-10 flex flex-col justify-between rounded-lg shadow-2xl">
          <img
            src={`http://localhost:8081/productImages/${order.productImage}`}
            alt={order.name}
            className="rounded-lg shadow-md"
          />

          <div className="pt-5 text-xl">
            <div className="flex justify-between text-2xl font-semibold">
              <p>{order.name}</p>
              <p>Php {order.totalPrice}</p>
            </div>
            <p>{order.brand}</p>
            <p>
              {order.flavor}, {order.size}, x{order.quantity}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-2 bg-white p-5 rounded-xl shadow-xl text-xl">
            <h2 className="flex items-center gap-3 text-3xl font-bold mb-3 text-purple-200">
              <FontAwesomeIcon icon={faTruckFast} />
              Shipping Information
            </h2>
            <p>
              <span className="font-bold">Shipping Mode:</span>{" "}
              {order.shippingMode}
            </p>
            <p>
              <span className="font-bold">Order Date:</span>{" "}
              {formatDate(order.orderDate)}
            </p>
            <p>
              <span className="font-bold">Receive Date:</span>{" "}
              {formatDate(order.receiveDate)}
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-xl text-xl">
            <h2 className="flex items-center gap-3 text-3xl font-bold mb-3 text-purple-200">
              <FontAwesomeIcon icon={faLocationDot} />
              Delivery Address
            </h2>
            <p>
              <span className="font-bold">Name:</span> {order.firstName}{" "}
              {order.lastName}
            </p>
            <p>
              <span className="font-bold">Email:</span> {order.email}
            </p>
            <p>
              <span className="font-bold">Phone Number:</span> {order.phone}
            </p>
            <p>
              <span className="font-bold">Address:</span> {order.street}{" "}
              {order.barangay} {order.municipality} {order.province}{" "}
              {order.zipCode}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xl text-xl">
            <h2 className="flex items-center gap-3 text-3xl font-bold mb-3 text-purple-200">
              <FontAwesomeIcon icon={faBarsProgress} />
              Status
            </h2>

            <div className="flex justify-between">
              <div
                className="w-fit h-fit flex items-center gap-3 rounded-3xl px-2 py-1"
                style={getStatusStyles(order.status)}
              >
                <FontAwesomeIcon icon={faCircle} className="text-sm" />
                <p className="font-bold text-xl">{order.status}</p>
              </div>
              <button className="bg-green-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-green-200 hover:bg-white hover:text-green-200 duration-300 ease-in-out">
                Receive Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
