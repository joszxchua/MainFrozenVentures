import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

export const IncomingOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  return (
    <>
      <div className="flex gap-3 text-5xl font-bold">
        <FontAwesomeIcon icon={faShoppingBag} />
        <h2>Incoming Orders</h2>
      </div>

      <div className="relative mt-10 min-h-[70vh] max-h-[70vh] font-inter">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.orderID}
              className="bg-gray-100 mt-5 px-4 py-3 rounded-lg"
            >
              <div className="bg-white flex items-center px-4 py-3 rounded-lg">
                <img
                  src={`http://localhost:8081/productImages/${order.productImage}`}
                  alt="Product Image"
                  className="w-[70px] h-[70px] rounded-2xl"
                />

                <div className="w-full flex justify-between gap-1 px-5">
                  <div className="w-full">
                    <h3 className="font-bold text-xl">{order.name}</h3>
                    <p className="text-gray-200">{order.brand}</p>
                  </div>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Flavor: </span>
                    {order.flavor}
                  </p>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Available Sizes:</span>{" "}
                    {order.totalSizes}
                  </p>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Total Stocks:</span>{" "}
                    {order.totalStock} Items Left
                  </p>

                  <div className="h-fit px-3 py-2 rounded-full hover:bg-gray-100 duration-300 ease-in-out">
                    {expandedOrderId === order.orderID ? (
                      <FontAwesomeIcon
                        onClick={handleCloseSizes}
                        icon={faChevronUp}
                        className="cursor-pointer"
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => handleShowSizes(order.orderID)}
                        icon={faChevronDown}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-3">
            <h2 className="text-4xl font-bold">No Orders</h2>
            <p className="text-lg text-center">
              Effortlessly manage and track your incoming orders, simplifying your workflow and enhancing
              productivity
            </p>
          </div>
        )}
      </div>
    </>
  );
};
