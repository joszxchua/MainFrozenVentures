import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglass,
  faCube,
  faCheckCircle,
  faExclamationCircle,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export const StatusDropdown = forwardRef(({ handleStatusSelect }, ref) => {
  return (
    <div ref={ref} className="absolute rounded-lg bg-gray-100 shadow-2xl">
      <ul className="flex flex-col font-bold text-left text-lg">
        <li
          className="text-gray-900 rounded-lg cursor-pointer hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={() => handleStatusSelect("All")}
        >
          <FontAwesomeIcon icon={faList} className="mr-3" />
          All
        </li>
        <li
          className="text-gray-900 rounded-lg cursor-pointer hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={() => handleStatusSelect("Pending")}
        >
          <FontAwesomeIcon icon={faHourglass} className="mr-3" />
          Pending
        </li>
        <li
          className="text-gray-900 rounded-lg cursor-pointer hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={() => handleStatusSelect("To Receive")}
        >
          <FontAwesomeIcon icon={faCube} className="mr-3" />
          To Receive
        </li>
        <li
          className="text-gray-900 rounded-lg cursor-pointer hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={() => handleStatusSelect("Received")}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-3" />
          Received
        </li>
        <li
          className="text-gray-900 rounded-lg cursor-pointer hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={() => handleStatusSelect("Cancelled")}
        >
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-3" />
          Cancelled
        </li>
      </ul>
    </div>
  );
});
