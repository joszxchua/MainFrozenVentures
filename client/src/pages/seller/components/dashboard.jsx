import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user.accountId) {
        try {
          const ordersResponse = await axios.post(
            "http://localhost:8081/order/sellerFetchOrders",
            { accountId: user.accountId }
          );
          if (ordersResponse.data.status === "success") {
            setOrders(ordersResponse.data.order);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user.accountId]);

  return (
    <>
      <div className="flex gap-3 text-5xl font-bold">
        <FontAwesomeIcon icon={faChartLine} />
        <h2>Dashboard</h2>
      </div>

      <div class="mt-10 grid grid-cols-3 grid-rows-2 gap-10 p-4 items-center text-white">
        <div class="py-5 h-full flex flex-col justify-center items-center gap-3 col-span-1 row-span-2 bg-purple-200 rounded-lg">
          <h3 class="text-center text-5xl font-semibold">Today's Sales</h3>
          <p className="text-xl">Php 500.00</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Orders</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Received</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Deliveries</h3>
          <p className="text-xl">10</p>
        </div>
        <div class="py-5 flex flex-col justify-center items-center gap-3  col-span-1 row-span-1 bg-purple-200 rounded-lg">
          <h3 class="text-3xl font-semibold">Refunds</h3>
          <p className="text-xl">10</p>
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <div className="w-full px-5">
          <h3 className="text-4xl font-bold">Summary</h3>
        </div>

        <div className="w-[70%] px-5">
          <h3 className="text-4xl font-bold pb-5 mb-5 border-b-2">
            Recent Orders
          </h3>

          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order, orderID) => (
              <div key={orderID} className="flex items-center gap-3 pb-5 mb-5">
                <img
                  src={`http://localhost:8081/profileImages/${order.profilePicture}`}
                  alt=""
                  className="w-16 h-16 rounded-2xl"
                />
                <div className="w-full">
                  <p className="text-xl font-bold">
                    {order.firstName} {order.lastName}
                  </p>

                  <div className="flex justify-between text-sm">
                    <div className="text-gray-200">
                      <p>{order.name}</p>
                      <p>
                        {order.flavor}, {order.size}, x{order.quantity}
                      </p>
                    </div>

                    <div>
                      <p>
                        <span className="font-bold">Total Price:</span> Php
                        {order.totalPrice}
                      </p>
                      <p>
                        <span className="font-bold">Order Date:</span>{" "}
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-4 py-10">
              <div className="flex justify-center text-4xl text-purple-200">
                <p className="font-bold">Nothing Here</p>
              </div>
              <p className="text-xl text-center font-semibold">
                It seems like there is no order yet
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
