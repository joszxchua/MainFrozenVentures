import React, { useContext, useState, useEffect } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const IncomingOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (user.accountId) {
        try {
          const productResponse = await axios.post(
            "http://localhost:8081/order/sellerFetchOrders",
            { accountId: user.accountId }
          );
          if (productResponse.data.status === "success") {
            const pendingOrders = productResponse.data.order.filter(
              (order) => order.status === "Pending"
            );
            setOrders(pendingOrders);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user.accountId]);

  const handleShowButton = (orderID) => {
    setExpandedOrderId(expandedOrderId === orderID ? null : orderID);
  };

  const handleCloseButton = () => {
    setExpandedOrderId(null);
  };

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

  const handleCloseChangeStatus = () => {
    setConfirmationTitle("");
    setConfirmationMessage("");
  };

  const handleYesConfirmation = async () => {
    setConfirmationTitle("");
    setConfirmationMessage("");

    if (expandedOrderId) {
      try {
        const statusResponse = await axios.post("http://localhost:8081/order/updateOrderStatus", {
          orderId: expandedOrderId,
        });
        if (statusResponse.data.status === "success") {
          setMessageTitle("Success");
          setMessage(statusResponse.data.message);
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
            cancelConfirmation={handleCloseChangeStatus}
            yesConfirmation={handleYesConfirmation}
          />
        </div>
      )}
      <div className="flex gap-3 text-5xl font-bold">
        <FontAwesomeIcon icon={faShoppingBag} />
        <h2>Incoming Orders</h2>
      </div>

      <div className="relative mt-10 min-h-[70vh] max-h-[70vh] font-inter overflow-auto">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.orderID}
              className="bg-gray-100 mt-5 px-4 py-3 rounded-lg"
            >
              <div className="bg-white flex items-center px-4 py-3 rounded-lg">
                <img
                  src={`http://localhost:8081/profileImages/${order.profilePicture}`}
                  alt="Product Image"
                  className="w-[70px] h-[70px] rounded-full"
                />

                <div className="w-full flex justify-between gap-1 px-5">
                  <div className="w-full">
                    <h3 className="font-bold text-xl">
                      {order.firstName} {order.lastName}
                    </h3>
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

                  <div className="h-fit px-3 py-2 rounded-full hover:bg-gray-100 duration-300 ease-in-out">
                    {expandedOrderId === order.orderID ? (
                      <FontAwesomeIcon
                        onClick={handleCloseButton}
                        icon={faChevronUp}
                        className="cursor-pointer"
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => handleShowButton(order.orderID)}
                        icon={faChevronDown}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
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
