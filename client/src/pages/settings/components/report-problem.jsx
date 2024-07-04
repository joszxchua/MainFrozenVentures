import React, { useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { UserContext } from "../../../context/user-context";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "rgb(123, 106, 194)" : provided.borderColor,
    boxShadow: state.isFocused
      ? "0 0 0 1px rgb(123, 106, 194)"
      : provided.boxShadow,
  }),
};

export const ReportProblem = () => {
  const { user } = useContext(UserContext);
  const { register, handleSubmit, reset } = useForm();
  const [isReportingProblem, setIsReportingProblem] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAbout, setSelectedAbout] = useState(null);

  const aboutOptions = [
    { label: "Select A Problem", value: "" },
    { label: "Bug", value: "Bug" },
    { label: "Feature Request", value: "Feature request" },
    { label: "Performance Issue", value: "Performance issue" },
    { label: "Other", value: "Other" },
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
        { ...data, about: selectedAbout, accountId: user.accountId }
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
      setSelectedAbout("");
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
      <div className="flex text-4xl font-bold">
        <FontAwesomeIcon icon={faCircleExclamation} className="mr-3" />
        <h2>Report A Problem</h2>
      </div>

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
            <Select
              styles={customStyles}
              className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
              options={aboutOptions}
              value={{
                value: selectedAbout,
                label: selectedAbout,
              }}
              onChange={(selectedOption) =>
                setSelectedAbout(selectedOption.value)
              }
              isDisabled={!isReportingProblem}
              placeholder="Select A Problem"
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="description" className="text-lg font-medium">
              Description:
            </label>
            <textarea
              name="description"
              id="description"
              disabled={!isReportingProblem}
              className="h-[245px] resize-none text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
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
