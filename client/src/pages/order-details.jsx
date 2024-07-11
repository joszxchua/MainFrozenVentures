import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useParams, useNavigate } from "react-router-dom";
import { SuccessMessage } from "../components/success-message";
import { ErrorMessage } from "../components/error-message";

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
            setOrder(orderResponse.data.product);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [orderId]);

  return (
    <div className="mt-20">
      <h1 className="">Order Details</h1>
    </div>
  );
};
