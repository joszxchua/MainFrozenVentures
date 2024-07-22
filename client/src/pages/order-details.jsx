import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { Confirmation } from "../components/confirmation";
import { ReviewProduct } from "../components/review-product";
import { CancelOrder } from "../components/cancel-order";
import { ErrorMessage } from "../components/error-message";
import { SuccessMessage } from "../components/success-message";
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
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [showCancelOrder, setShowCancelOrder] = useState(false);

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

  const handleReceiveOrder = () => {
    setConfirmation(true);
    setConfirmationTitle("Receive Order");
    setConfirmationMessage("Are you sure that you want to receive this order?");
  };

  const handleCancelConfirmation = () => {
    setConfirmation(false);
  };

  const handleReviewProduct = () => {
    setReviewProduct(true);
  };

  const handleCancelReview = () => {
    setReviewProduct(false);
  };

  const handleReviewResult = (title, message) => {
    setMessageTitle(title);
    setMessage(message);
    setReviewProduct(false);

    if (title === "Success") {
      setOrder((prevOrder) => ({
        ...prevOrder,
        isReviewed: 1,
      }));
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleYesConfirmation = async () => {
    if (confirmationTitle === "Receive Order") {
      try {
        const response = await axios.post(
          "http://localhost:8081/order/receiveOrder",
          {
            orderId: orderId,
          }
        );
        if (response.data.status === "success") {
          setMessageTitle("Success");
          setMessage(response.data.message);
          setOrder((prevOrder) => ({
            ...prevOrder,
            status: "Received",
          }));
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

    setConfirmation(false);
    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleCancelOrder = () => {
    setShowCancelOrder(true);
  };

  const handleCancelCancel = () => {
    setShowCancelOrder(false);
  };

  const handleCancelResult = (title, message) => {
    setMessageTitle(title);
    setMessage(message);
    setShowCancelOrder(false);

    if (title === "Success") {
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: "Cancelled",
      }));
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="my-20 px-20 py-5 font-inter">
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      {confirmation && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 z-30">
          <Confirmation
            confirmationTitle={confirmationTitle}
            confirmationMessage={confirmationMessage}
            cancelConfirmation={handleCancelConfirmation}
            yesConfirmation={handleYesConfirmation}
          />
        </div>
      )}
      {reviewProduct && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 z-30">
          <ReviewProduct
            cancelReview={handleCancelReview}
            order={order}
            onResult={handleReviewResult}
          />
        </div>
      )}
      {showCancelOrder && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 z-30">
          <CancelOrder
            cancelCancel={handleCancelCancel}
            order={order}
            onResult={handleCancelResult}
          />
        </div>
      )}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold">Order Details</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="p-10 flex flex-col justify-between rounded-lg shadow-2xl">
          <img
            src={`http://localhost:8081/productImages/${order.productImage}`}
            alt={order.name}
            className="w-[550px] rounded-lg shadow-md"
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

              {order.status === "Pending" && (
                <button
                  onClick={handleCancelOrder}
                  className="bg-red-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-red-200 hover:bg-white hover:text-red-200 duration-300 ease-in-out"
                >
                  Cancel Order
                </button>
              )}

              {order.status === "To Receive" && order.isReviewed === 0 && (
                <button
                  onClick={handleReceiveOrder}
                  className="bg-green-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-green-200 hover:bg-white hover:text-green-200 duration-300 ease-in-out"
                >
                  Receive Order
                </button>
              )}

              {order.status === "Received" && order.isReviewed === 1 && (
                <div
                  className="w-fit h-fit flex items-center gap-3 rounded-3xl px-2 py-1"
                  style={getStatusStyles(order.status)}
                >
                  <FontAwesomeIcon icon={faCircle} className="text-sm" />
                  <p className="font-bold text-xl">Reviewed</p>
                </div>
              )}

              {order.status === "Received" && order.isReviewed === 0 && (
                <button
                  onClick={handleReviewProduct}
                  className="bg-green-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-green-200 hover:bg-white hover:text-green-200 duration-300 ease-in-out"
                >
                  Review Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
