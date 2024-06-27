import React, { useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../context/user-context";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";

export const SetUpShop = () => {
  const { user } = useContext(UserContext);
  const { register, handleSubmit, reset } = useForm();
  const [isReportingProblem, setIsReportingProblem] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      {messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      <div className="flex text-4xl font-bold">
        <FontAwesomeIcon icon={faShop} className="mr-3" />
        <h2>Set Up Shop</h2>
      </div>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-28 font-semibold text-gray-200">Set Up Shop</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="description" className="text-lg font-medium">
              Description:
            </label>
            <textarea
              name="description"
              id="description"
              className="h-[245px] text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200 resize-none"
              {...register("description")}
            />
          </div>

          {isReportingProblem ? (
            <div className="mt-5 w-full flex justify-around">
              <button
                type="button"
                className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Report Problem
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
