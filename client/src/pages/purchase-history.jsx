import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const PurchaseHistory = () => {
  const { user } = useContext(UserContext);
  const [ordersInfo, setOrdersInfo] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "ascending",
  });

  useEffect(() => {
    const fetchOrderInfo = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/order/fetchOrders",
            { accountId: user.accountId }
          );
          if (response.data.status === "success") {
            const orderData = response.data.order;
            setOrdersInfo(orderData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchOrderInfo();
  }, [user.accountId]);

  const sortOrders = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedOrders = [...ordersInfo].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setOrdersInfo(sortedOrders);
  };

  return (
    <div className="mt-20 px-10">
      <div>
        <h2 className="font-bold text-4xl">Purchase History</h2>
        <p className="text-lg text-gray-200">
          Review and manage your ice cream purchases
        </p>
      </div>

      <div className="my-5 bg-gray-100 p-5 rounded-lg">
        <table className="w-full">
          <thead className="w-full">
            <tr className="w-full flex justify-between text-2xl pb-5 mb-5 border-b-2 border-black">
              <th className="w-2/12 text-left">Product</th>
              <th className="w-1/12">Shop</th>
              <th className="w-1/12">Total Price</th>
              <th
                className="w-2/12 cursor-pointer"
                onClick={() => sortOrders("orderDate")}
              >
                Order Date{" "}
                <FontAwesomeIcon
                  icon={
                    sortConfig.key === "orderDate" &&
                    sortConfig.direction === "ascending"
                      ? faArrowUp
                      : faArrowDown
                  }
                />
              </th>
              <th
                className="w-2/12 cursor-pointer"
                onClick={() => sortOrders("receiveDate")}
              >
                Delivery Date{" "}
                <FontAwesomeIcon
                  icon={
                    sortConfig.key === "receiveDate" &&
                    sortConfig.direction === "ascending"
                      ? faArrowUp
                      : faArrowDown
                  }
                />
              </th>
              <th className="w-1/12">Status</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {ordersInfo.map((order, orderID) => (
              <tr
                key={orderID}
                className="w-full flex items-center justify-between text-center text-xl font-medium mb-5"
              >
                <td className="w-2/12 text-left flex gap-5 items-center">
                  <img
                    src={`http://localhost:8081/productImages/${order.productImage}`}
                    alt={order.name}
                    className="w-20 rounded-lg"
                  />
                  <div>
                    <p className="text-xl font-semibold">{order.name}</p>
                    <p className="text-sm text-gray-200">{order.brand}</p>
                    <p className="text-sm text-gray-200">
                      {order.flavor}, {order.size}
                    </p>
                  </div>
                </td>
                <td className="w-1/12">{order.shopName}</td>
                <td className="w-1/12">{order.totalPrice.toFixed(2)}</td>
                <td className="w-2/12">{formatDate(order.orderDate)}</td>
                <td className="w-2/12">{formatDate(order.receiveDate)}</td>
                <td className="w-1/12 flex justify-center">
                  <div className="w-fit h-fit flex items-center gap-3 rounded-3xl bg-gray-300 px-2 py-1 text-gray-200">
                    <FontAwesomeIcon icon={faCircle} />
                    <p className="font-bold text-xl">{order.status}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
