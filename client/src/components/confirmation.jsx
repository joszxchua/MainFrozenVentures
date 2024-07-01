import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const Confirmation = ({
  confirmationTitle,
  confirmationMessage,
  cancelConfirmation,
}) => {
  return (
    <div className="relative flex flex-col gap-3 bg-white p-10 rounded-lg max-h-[80vh] overflow-auto">
      <FontAwesomeIcon
        icon={faXmark}
        onClick={cancelConfirmation}
        className="absolute top-5 right-5 text-2xl cursor-pointer"
      />
      <h2 className="text-2xl font-bold">{confirmationTitle}</h2>
      <p className="text-xl">{confirmationMessage}</p>

      <div className="mt-5 flex justify-around">
        <button
          onClick={cancelConfirmation}
          className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
        >
          Cancel
        </button>
        <button className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
          Yes
        </button>
      </div>
    </div>
  );
};
