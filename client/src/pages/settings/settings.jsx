import React, { act, useContext, useState } from "react";
import { UserContext } from "../../context/user-context";
import { Profile } from "./components/profile";
import { Security } from "./components/security";
import { ReportProblem } from "./components/report-problem";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faLock,
  faClockRotateLeft,
  faCircleExclamation,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export const Settings = () => {
  const { user, clearUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setActiveTab("profile");
  };

  const handleSecurityClick = () => {
    setActiveTab("security");
  };

  const handlePurchaseHistoryClick = () => {
    navigate("/purchase-history");
  };

  const handleReportProblemClick = () => {
    setActiveTab("reportProblem");
  };

  const handleSignOutClick = () => {
    clearUser();
    navigate("/");
  };

  const handleEditPicture = () => {
    setIsEditingPicture(true);
  };

  const handleCancelEditPicture = () => {
    setIsEditingPicture(false);
  };

  return (
    <div className="mt-20 mb-10 grid grid-cols-4 font-inter">
      <div className="col-span-1 h-full px-5">
        <div className="bg-gray-100 p-8 rounded-lg">
          <div>
            <h2 className="text-4xl font-bold">Settings</h2>
            <p className="text-lg text-gray-200">
              Manage your profile, security, and history
            </p>
          </div>

          <ul className="flex flex-col gap-4 pt-10 font-bold">
            <li
              onClick={handleProfileClick}
              className={`text-2xl ${
                activeTab === "profile" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faCircleUser} className="mr-3" />
              Profile
            </li>
            <li
              onClick={handleSecurityClick}
              className={`text-2xl ${
                activeTab === "security" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faLock} className="mr-3" />
              Security
            </li>
            <li
              onClick={handlePurchaseHistoryClick}
              className="text-2xl cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
            >
              <FontAwesomeIcon icon={faClockRotateLeft} className="mr-3" />
              Purchase History
            </li>
            <li
              onClick={handleReportProblemClick}
              className="text-2xl cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
            >
              <FontAwesomeIcon icon={faCircleExclamation} className="mr-3" />
              Report A Problem
            </li>
            <li
              onClick={handleSignOutClick}
              className="mt-20 text-2xl cursor-pointer hover:bg-red-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
            >
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="mr-3"
              />
              Sign Out
            </li>
          </ul>
        </div>
      </div>

      <div className="col-span-2 h-full">
        <div className="bg-gray-100 p-8 rounded-lg">
          {activeTab === "profile" && <Profile />}
          {activeTab === "security" && <Security />}
          {activeTab === "reportProblem" && <ReportProblem />}
        </div>
      </div>

      <div className="col-span-1 h-full px-5">
        <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-center gap-5">
          <h3 className="font-bold text-4xl">Profile Picture</h3>
          <FontAwesomeIcon icon={faCircleUser} className="text-[250px]" />
          {activeTab === "profile" && (
            <>
              {isEditingPicture ? (
                <div className="w-full flex justify-around">
                  <button
                    type="button"
                    onClick={handleCancelEditPicture}
                    className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditPicture}
                  className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                >
                  Change profile picture
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
