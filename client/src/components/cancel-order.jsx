import React, { useContext, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { UserContext } from "../context/user-context";
import { useForm } from "react-hook-form";
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

export const CancelOrder = ({ cancelCancel, onResult }) => {
  const { user } = useContext(UserContext);
  const { register, handleSubmit, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form className="relative flex flex-col gap-3 bg-white p-10 rounded-lg">
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
        <h2 className="text-2xl font-bold">Cancel Order</h2>
        <p className="text-lg">Are you sure you want to cancel this order?</p>
      </div>

      <Select
        styles={customStyles}
        className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Prefer not to say", label: "Prefer not to say" },
        ]}
      />

      <div className="my-2 flex justify-around">
        <button
          onClick={cancelCancel}
          className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
        >
          Cancel
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
