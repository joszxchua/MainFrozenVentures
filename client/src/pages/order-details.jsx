import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useParams } from "react-router-dom";
import { SuccessMessage } from "../components/success-message";
import { ErrorMessage } from "../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faIceCream } from "@fortawesome/free-solid-svg-icons";

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
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <button className="bg-red-500 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-red-500 hover:bg-white hover:text-red-500 duration-300 ease-in-out">
          Cancel Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1">
          <img
            src={`http://localhost:8081/productImages/${order.productImage}`}
            alt={order.name}
            className="rounded-lg shadow-md m-auto"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-5">
          <div className="bg-white p-5 rounded-xl shadow-md text-xl">
            <h2 className="flex items-center gap-3 text-3xl font-bold mb-3">
              <FontAwesomeIcon icon={faIceCream} />
              Product Details
            </h2>
            <p className="text-2xl font-semibold">{order.name}</p>
            <p>{order.brand}</p>
            <p>
              {order.flavor}, {order.size}, x{order.quantity}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-xl text-xl">
            <h2 className="flex items-center gap-3 text-3xl font-bold mb-3">
              <FontAwesomeIcon icon={faLocationDot} />
              Delivery Address
            </h2>
            <p>
              {order.firstName} {order.lastName}
            </p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
            <p>
              {order.street} {order.barangay} {order.municipality}{" "}
              {order.province} {order.zipCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
