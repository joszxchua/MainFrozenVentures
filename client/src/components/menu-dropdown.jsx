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
    props.closeDropdown();
    navigate(`/settings?tab=${tab}`);
  };

  const handlePurchaseHistory = () => {
    props.closeDropdown();
    navigate("/purchase-history");
  };

  const handleSignOutClick = () => {
    props.closeDropdown();
    clearUser();
    navigate("/");
  };

  return (
    <div
      ref={ref}
      className="fixed top-[77px] right-[5px] rounded-lg bg-gray-100 shadow-xl"
    >
      <ul className="flex flex-col font-bold text-lg">
        <li
          className="text-gray-900 rounded-lg cursor-pointer hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={() => handleNavigation("profile")}
        >
          <FontAwesomeIcon icon={faCircleUser} className="mr-3" />
          Profile
        </li>
        <li
          className="text-gray-900 rounded-lg cursor-pointer hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={() => handleNavigation("security")}
        >
          <FontAwesomeIcon icon={faLock} className="mr-3" />
          Security
        </li>
        <li
          className="cursor-pointer rounded-lg hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={handlePurchaseHistory}
        >
          <FontAwesomeIcon icon={faClockRotateLeft} className="mr-3" />
          Purchase History
        </li>
        {user?.userRole !== "customer" && (
          <li
            className="text-gray-900 cursor-pointer rounded-lg hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
            onClick={() => handleNavigation("setUpShop")}
          >
            <FontAwesomeIcon icon={faShop} className="mr-3" />
            Set Up Shop
          </li>
        )}
        <li
          className="text-gray-900 cursor-pointer rounded-lg hover:bg-purple-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={() => handleNavigation("reportProblem")}
        >
          <FontAwesomeIcon icon={faCircleExclamation} className="mr-3" />
          Report A Problem
        </li>
        <li
          className="mt-20 cursor-pointer rounded-lg hover:bg-red-200 hover:text-white p-3 duration-300 ease-in-out"
          onClick={handleSignOutClick}
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-3" />
          Sign Out
        </li>
      </ul>
    </div>
  );
});
