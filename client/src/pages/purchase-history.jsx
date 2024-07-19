import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { StatusDropdown } from "../components/status-dropdown";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faCircle,
  faChevronDown,
  faChevronUp,
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
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const ordersPerPage = 5;

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

  const handleClickOutside = (event) => {
    if (
      statusDropdownRef.current &&
      !statusDropdownRef.current.contains(event.target)
    ) {
      setShowStatusDropdown(false);
    }
  };

  const handleStatusClick = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };

  useEffect(() => {
    if (showStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = ordersInfo.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOrderClick = (orderId) => {
    navigate(`/order-details/${orderId}`);
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
            <tr className="w-full flex justify-between text-2xl px-5 pb-5 mb-5 border-b-2 border-black">
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
              <th
                onClick={handleStatusClick}
                className="relative w-1/12 cursor-pointer"
              >
                Status{" "}
                <FontAwesomeIcon
                  icon={showStatusDropdown ? faChevronUp : faChevronDown}
                />
                {showStatusDropdown && (
                  <StatusDropdown ref={statusDropdownRef} />
                )}
              </th>
            </tr>
          </thead>
          <tbody className="w-full">
            <div className="min-h-[500px]">
              {currentOrders.map((order) => (
                <tr
                  key={order.orderID}
                  onClick={() => handleOrderClick(order.orderID)}
                  className="w-full flex items-center justify-between text-center text-xl font-medium p-5 rounded-lg hover:text-white hover:bg-purple-200 duration-300 cursor-pointer ease-in-out group"
                >
                  <td className="w-2/12 text-left flex gap-5 items-center">
                    <img
                      src={`http://localhost:8081/productImages/${order.productImage}`}
                      alt={order.name}
                      className="w-20 rounded-lg"
                    />
                    <div>
                      <p className="text-xl font-bold">{order.name}</p>
                      <p className="text-sm text-gray-200 group-hover:text-white duration-300">
                        {order.brand}
                      </p>
                      <p className="text-sm text-gray-200 group-hover:text-white duration-300">
                        {order.flavor}, {order.size}, x{order.quantity}
                      </p>
                    </div>
                  </td>
                  <td className="w-1/12">{order.shopName}</td>
                  <td className="w-1/12">Php {order.totalPrice.toFixed(2)}</td>
                  <td className="w-2/12">{formatDate(order.orderDate)}</td>
                  <td className="w-2/12">{formatDate(order.receiveDate)}</td>
                  <td className="w-1/12 flex justify-center">
                    <div
                      className="w-fit h-fit flex items-center gap-3 rounded-3xl px-2 py-1"
                      style={getStatusStyles(order.status)}
                    >
                      <FontAwesomeIcon icon={faCircle} className="text-sm" />
                      <p className="font-bold text-xl">{order.status}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </div>
          </tbody>
        </table>

        <div className="mt-4 flex justify-center">
          {Array.from(
            { length: Math.ceil(ordersInfo.length / ordersPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded-lg font-bold ${
                  currentPage === i + 1
                    ? "bg-gray-200 text-white"
                    : "bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
