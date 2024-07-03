import React, { useContext, forwardRef } from "react";
import { UserContext } from "../context/user-context";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faLock,
  faClockRotateLeft,
  faCircleExclamation,
  faArrowRightFromBracket,
  faShop,
} from "@fortawesome/free-solid-svg-icons";

export const MenuDropdown = forwardRef((props, ref) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleNavigation = (tab) => {
    navigate(`/settings?tab=${tab}`);
  };

  const handlePurchaseHistory = () => {
    navigate("/purchase-history");
  };

  const handleSignOutClick = () => {
    clearUser();
    navigate("/");
  };

  return (
    <div
      ref={ref}
      className="fixed top-[72px] right-0 rounded-bl-lg bg-white border-l-2 border-b-2 border-purple-200 p-5"
    >
      <ul className="flex flex-col gap-4 font-bold text-2xl">
        <li
          className="text-gray-900 cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
          onClick={() => handleNavigation("profile")}
        >
          <FontAwesomeIcon icon={faCircleUser} className="mr-3" />
          Profile
        </li>
        <li
          className="text-gray-900 cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
          onClick={() => handleNavigation("security")}
        >
          <FontAwesomeIcon icon={faLock} className="mr-3" />
          Security
        </li>
        <li
          className="cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
          onClick={handlePurchaseHistory}
        >
          <FontAwesomeIcon icon={faClockRotateLeft} className="mr-3" />
          Purchase History
        </li>
        {user.userRole !== "customer" && (
          <li
            className="text-gray-900 cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
            onClick={() => handleNavigation("setUpShop")}
          >
            <FontAwesomeIcon icon={faShop} className="mr-3" />
            Set Up Shop
          </li>
        )}
        <li
          className="text-gray-900 cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
          onClick={() => handleNavigation("reportProblem")}
        >
          <FontAwesomeIcon icon={faCircleExclamation} className="mr-3" />
          Report A Problem
        </li>
        <li
          className="mt-20 cursor-pointer hover:bg-red-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
          onClick={handleSignOutClick}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-3" />
          Sign Out
        </li>
      </ul>
    </div>
  );
});
