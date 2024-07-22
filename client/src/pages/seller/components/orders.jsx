import React, { useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { Confirmation } from "../../../components/confirmation";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faChevronDown,
  faChevronUp,
  faArrowUp,
  faArrowDown,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const capitalizeFirstChar = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const smsFormat = (str) => {
  if (str && str.length > 0) {
    return `63${str.slice(1)}`;
  }
  return str;
};

export const Orders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [currentFilter, setCurrentFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [smsApiKey, setSmsApiKey] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user.accountId) {
        try {
          const productResponse = await axios.post(
            "http://localhost:8081/order/sellerFetchOrders",
            { accountId: user.accountId }
          );
          if (productResponse.data.status === "success") {
            setOrders(productResponse.data.order);
            setSmsApiKey(productResponse.data.smsApiKey);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user.accountId]);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;
    if (currentFilter !== "All") {
      filtered = orders.filter((order) => order.status === currentFilter);
    }
    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.orderDate) - new Date(b.orderDate)
        : new Date(b.orderDate) - new Date(a.orderDate)
    );
  }, [orders, currentFilter, sortOrder]);

  const handleChangeStatus = (shippingMode) => {
    setConfirmationTitle(
      shippingMode === "Pickup" ? "Ready For Pickup" : "Ship Product"
    );
    setConfirmationMessage(
      shippingMode === "Pickup"
        ? "Is this product ready for pickup?"
        : "Is this product ready to be shipped?"
    );
  };

  const handleYesConfirmation = async () => {
    setConfirmationTitle("");
    setConfirmationMessage("");
    setExpandedOrderId(null);

    if (expandedOrderId) {
      const order = orders.find((o) => o.orderID === expandedOrderId);
      if (!order) return;

      try {
        const statusResponse = await axios.post(
          "http://localhost:8081/order/updateOrderStatus",
          { orderId: expandedOrderId }
        );

        await axios.post("http://localhost:8081/product/updateStock", {
          productId: order.productID,
          sizeId: order.sizeID,
          quantity: order.quantity,
        });

        if (statusResponse.data.status === "success") {
          setMessageTitle("Success");
          setMessage(statusResponse.data.message);

          const messageText =
            order.shippingMode === "Pickup"
              ? `Good day ${capitalizeFirstChar(
                  order.firstName
                )} ${capitalizeFirstChar(
                  order.lastName
                )}, FrozenVentures Pickup!\n\nYour order ${order.name} ${
                  order.flavor
                }, ${order.size}, x${
                  order.quantity
                } is ready for pickup. Please prepare the exact amount of Php ${order.totalPrice.toFixed(
                  2
                )}.`
              : `Good day ${capitalizeFirstChar(
                  order.firstName
                )} ${capitalizeFirstChar(
                  order.lastName
                )}, FrozenVentures Delivery!\n\nYour order ${order.name} ${
                  order.flavor
                }, ${order.size}, x${
                  order.quantity
                } is on the way, please prepare the exact amount of Php ${order.totalPrice.toFixed(
                  2
                )}.`;

          const data = {
            messages: [
              {
                destinations: [{ to: `${smsFormat(order.phone)}` }],
                from: "FrozenVenturesSMS",
                text: messageText,
              },
            ],
          };

          const myHeaders = {
            Authorization: `App ${smsApiKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          };

          try {
            const response = await axios.post(
              "https://vvn3gp.api.infobip.com/sms/2/text/advanced",
              data,
              { headers: myHeaders }
            );
            console.log("SMS sent successfully:", response.data);
          } catch (error) {
            console.error(
              "Error sending SMS:",
              error.response ? error.response.data : error.message
            );
          }

          const productResponse = await axios.post(
            "http://localhost:8081/order/sellerFetchOrders",
            { accountId: user.accountId }
          );

          if (productResponse.data.status === "success") {
            setOrders(productResponse.data.order);
          }
        } else {
          setMessageTitle("Error");
          setMessage("Something went wrong");
        }
      } catch (error) {
        console.log(error);
        setMessageTitle("Error");
        setMessage("Something went wrong");
      }
    }
    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Received":
        return {
          background: "#ADFF97",
          color: "#239205",
        };
      case "To Receive":
        return {
          background: "#F7EA8A",
          color: "#AE9900",
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
    <>
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      {confirmationTitle && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 z-30">
          <Confirmation
            confirmationTitle={confirmationTitle}
            confirmationMessage={confirmationMessage}
            cancelConfirmation={() => {
              setConfirmationTitle("");
              setConfirmationMessage("");
            }}
            yesConfirmation={handleYesConfirmation}
          />
        </div>
      )}
      <div className="flex gap-3 text-4xl font-bold">
        <FontAwesomeIcon icon={faShoppingBag} />
        <h2>Orders</h2>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex gap-5">
          {["All", "Pending", "To Receive", "Received", "Cancelled"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`w-fit px-3 py-1 rounded-md border-2 font-bold text-lg ${
                  currentFilter === filter
                    ? "bg-purple-200 text-white border-purple-200"
                    : "bg-white text-purple-200 border-purple-200 hover:bg-purple-200 duration-300 hover:text-white ease-in-out"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="flex items-center gap-1 font-bold text-lg"
        >
          Order Date
          <FontAwesomeIcon
            icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
          />
        </button>
      </div>

      <div className="relative mt-5 min-h-[70vh] max-h-[70vh] font-inter overflow-auto">
        {filteredAndSortedOrders.length > 0 ? (
          filteredAndSortedOrders.map((order) => (
            <div
              key={order.orderID}
              className="bg-gray-100 mt-5 px-4 py-3 rounded-lg"
            >
              <div className="bg-white flex items-center px-4 py-3 rounded-lg">
                <img
                  src={`http://localhost:8081/profileImages/${order.profilePicture}`}
                  alt="Product Image"
                  className="w-[70px] h-[70px] rounded-2xl"
                />

                <div className="w-full flex justify-between gap-1 px-5">
                  <div className="w-full">
                    <h3 className="font-bold text-xl">
                      {order.firstName} {order.lastName}
                    </h3>
                    <div
                      className="w-fit h-fit flex items-center gap-3 rounded-3xl px-2 py-1"
                      style={getStatusStyles(order.status)}
                    >
                      <FontAwesomeIcon icon={faCircle} className="text-sm" />
                      <p className="font-bold text-sm">{order.status}</p>
                    </div>
                  </div>

                  <div className="w-full">
                    <h4 className="font-bold">{order.name}</h4>
                    <p className="text-gray-200">
                      {order.flavor}, {order.size}, x{order.quantity}
                    </p>
                  </div>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Order Date: </span>
                    {formatDate(order.orderDate)}
                  </p>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Receive Date:</span>{" "}
                    {formatDate(order.receiveDate)}
                  </p>

                  {order.status === "Pending" && (
                    <div className="h-fit px-3 py-2 rounded-full hover:bg-gray-100 duration-300 ease-in-out">
                      {expandedOrderId === order.orderID ? (
                        <FontAwesomeIcon
                          onClick={() => setExpandedOrderId(null)}
                          icon={faChevronUp}
                          className="cursor-pointer"
                        />
                      ) : (
                        <FontAwesomeIcon
                          onClick={() => setExpandedOrderId(order.orderID)}
                          icon={faChevronDown}
                          className="cursor-pointer"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {expandedOrderId === order.orderID && (
                <div className="flex flex-col items-end mt-3">
                  <div className="flex items-center bg-white w-[75%] px-3 py-2 rounded-lg">
                    <p className="w-full">
                      <span className="font-bold">Acquisition Method: </span>
                      {order.shippingMode}
                    </p>

                    <div className="w-[50%] flex items-center justify-end">
                      <button
                        onClick={() => handleChangeStatus(order.shippingMode)}
                        className="w-fit bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                      >
                        {order.shippingMode === "Pickup"
                          ? "Ready For Pickup"
                          : "Ship Ice Cream"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-3">
            <h2 className="text-4xl font-bold">No Orders</h2>
            <p className="text-lg text-center">
              Effortlessly manage and track your incoming orders, simplifying
              your workflow and enhancing productivity
            </p>
          </div>
        )}
      </div>
    </>
  );
};
