import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useParams } from "react-router-dom";
import { SuccessMessage } from "../components/success-message";
import { ErrorMessage } from "../components/error-message";

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

  return (
    <div className="h-screen pt-20 px-10 pb-10 font-inter">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <button
          className="bg-red-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-red-200 hover:bg-white duration-300 hover:text-red-200 ease-in-out"
        >
          Cancel Order
        </button>
      </div>

      <div className="my-5 flex gap-5">
        <img
          src={`http://localhost:8081/productImages/${order.productImage}`}
          alt={order.name}
          className="w-60 rounded-lg"
        />

        <div className="flex flex-col justify-around text-xl">
          <h2 className="text-3xl font-bold">{order.name}</h2>
          <p>{order.brand}</p>
          <p>
            {order.flavor}, {order.size}, x{order.quantity}
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

        <div className="flex flex-col justify-around text-xl">
          <p>
            <span className="font-bold">Street:</span> {order.street}
          </p>
          <p>
            <span className="font-bold">Barangay:</span> {order.barangay}
          </p>
          <p>
            <span className="font-bold">Municipality:</span>{" "}
            {order.municipality}
          </p>
          <p>
            <span className="font-bold">Province:</span> {order.province}
          </p>
          <p>
            <span className="font-bold">Zip Code:</span> {order.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
};
