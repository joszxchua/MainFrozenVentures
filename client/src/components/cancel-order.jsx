import React, { useContext, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { UserContext } from "../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "rgb(123, 106, 194)" : provided.borderColor,
    boxShadow: state.isFocused
      ? "0 0 0 1px rgb(123, 106, 194)"
      : provided.boxShadow,
  }),
};

export const CancelOrder = ({ cancelCancel, order, onResult }) => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) {
      setError("Please select a reason");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8081/order/cancelOrder",
        {
          reason: selectedReason.value,
          accountId: user.accountId,
          orderId: order.orderID,
        }
      );
      if (response.data.status === "success") {
        onResult("Success", response.data.message);
      } else if (response.data.status === "error") {
        onResult("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling order: ", error);
      onResult("Error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReasonChange = (selectedOption) => {
    setSelectedReason(selectedOption);
  };

  return (
    <form
      className="relative flex flex-col gap-3 bg-white p-10 rounded-lg"
      onSubmit={onSubmit}
    >
      <FontAwesomeIcon
        icon={faXmark}
        onClick={cancelCancel}
        className="absolute top-5 right-5 text-2xl cursor-pointer"
      />
      <div className="flex flex-col items-center gap-2">
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className="text-4xl text-red-200"
        />
        <h2 className="text-3xl font-bold">Cancel Order</h2>
        <p className="text-lg">Are you sure you want to cancel this order?</p>
      </div>

      <div className="my-5">
        <p className="mb-1 font-semibold">Select a reason:</p>
        <Select
          styles={customStyles}
          className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
          options={[
            { value: "Ordered by mistake", label: "Ordered by mistake" },
            {
              value: "Found a better price elsewhere",
              label: "Found a better price elsewhere",
            },
            { value: "Item no longer needed", label: "Item no longer needed" },
            { value: "Changed mind", label: "Changed mind" },
            {
              value: "Ordered incorrect item/size",
              label: "Ordered incorrect item/size",
            },
            { value: "Other...", label: "Other..." },
          ]}
          value={selectedReason}
          onChange={handleReasonChange}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>

      <div className="my-2 flex justify-around">
        <button
          type="button"
          onClick={cancelCancel}
          className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
        >
          Go Back
        </button>
        <button
          type="submit"
          className="bg-red-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-red-200 hover:bg-white duration-300 hover:text-red-200 ease-in-out"
        >
          {isLoading ? "Loading..." : "Yes, cancel"}
        </button>
      </div>
    </form>
  );
};
