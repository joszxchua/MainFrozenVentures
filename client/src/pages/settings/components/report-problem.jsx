import React, { useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../context/user-context";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";

export const ReportProblem = () => {
  const { user } = useContext(UserContext);
  const { register, handleSubmit, reset } = useForm();
  const [isReportingProblem, setIsReportingProblem] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

  const aboutOptions = [
    { label: "Select A Problem", value: "" },
    { label: "Bug", value: "bug" },
    { label: "Feature Request", value: "feature request" },
    { label: "Performance Issue", value: "performance issue" },
    { label: "Other", value: "other" },
  ];

  const handleReportProblem = () => {
    setIsReportingProblem(true);
  };

  const handleCancelReportProblem = () => {
    setIsReportingProblem(false);
    reset();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/account/reportProblem",
        { ...data, accountId: user.accountId }
      );

      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
      } else {
        setMessageTitle("Error");
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
      reset();
      setIsReportingProblem(false);
    }, 3000);
  };

  return (
    <>
      {messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      <h2 className="text-4xl font-bold">Report A Problem</h2>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-24 font-semibold text-gray-200">Report</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form
          className="flex flex-col items-center gap-5 py-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="about" className="text-lg font-medium">
              About:
            </label>
            <select
              name="about"
              id="about"
              disabled={!isReportingProblem}
              className="text-lg px-2 py-2 rounded-lg border-2 border-black outline-purple-200"
              {...register("about")}
            >
              {aboutOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="description" className="text-lg font-medium">
              Description:
            </label>
            <textarea
              name="description"
              id="description"
              disabled={!isReportingProblem}
              className="h-[245px] text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200 resize-none"
              {...register("description")}
            />
          </div>

          {isReportingProblem ? (
            <div className="mt-5 w-full flex justify-around">
              <button
                type="button"
                onClick={handleCancelReportProblem}
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
                onClick={handleReportProblem}
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
