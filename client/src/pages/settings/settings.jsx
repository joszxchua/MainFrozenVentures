import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
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
  const [profilePicture, setProfilePicture] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/account/accountFetch",
            {
              accountId: user.accountId,
            }
          );
          if (response.data.status === 1) {
            const userData = response.data.account;
            setProfilePicture(userData.profilePicture);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId]);

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

  const handleSelectPicture = () => {
    document.getElementById("fileInput").click();
  };

  const handleCancelEditPicture = () => {
    setIsEditingPicture(false);
    setProfilePicture(null);
  };

  const handleSavePicture = async () => {
    if (!profilePicture) {
      console.log("No picture selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("accountId", user.accountId);
      formData.append("profilePicture", profilePicture);

      const response = await axios
        .post("http://localhost:8081/account/uploadProfilePicture", formData)
        .then((response) => {
          if (response.data.status === "success") {
          }
        });
    } catch (error) {
      console.error(error);
    }
    setIsEditingPicture(false);
  };

  return (
    <div className="mt-20 mb-10 grid grid-cols-4 font-inter">
      <div className="col-span-1 h-full px-5">
        <div className="shadow-2xl p-8 rounded-lg">
          <div>
            <h2 className="text-4xl font-bold">Settings</h2>
            <p className="text-lg text-gray-200">
              Manage your profile, security, and history
            </p>
          </div>

          <ul className="flex flex-col gap-4 pt-10 font-bold text-2xl">
            <li
              onClick={handleProfileClick}
              className={`${
                activeTab === "profile" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faCircleUser} className="mr-3" />
              Profile
            </li>
            <li
              onClick={handleSecurityClick}
              className={`${
                activeTab === "security" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faLock} className="mr-3" />
              Security
            </li>
            <li
              onClick={handlePurchaseHistoryClick}
              className="cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
            >
              <FontAwesomeIcon icon={faClockRotateLeft} className="mr-3" />
              Purchase History
            </li>
            <li
              onClick={handleReportProblemClick}
              className={`${
                activeTab === "reportProblem"
                  ? "text-purple-200"
                  : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faCircleExclamation} className="mr-3" />
              Report A Problem
            </li>
            <li
              onClick={handleSignOutClick}
              className="mt-20 cursor-pointer hover:bg-red-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out"
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
        <div className="shadow-2xl p-8 rounded-lg">
          {activeTab === "profile" && <Profile />}
          {activeTab === "security" && <Security />}
          {activeTab === "reportProblem" && <ReportProblem />}
        </div>
      </div>

      <div className="col-span-1 h-full px-5">
        <div className="shadow-2xl p-8 rounded-lg flex flex-col items-center gap-5">
          <h3 className="font-bold text-4xl">Profile Picture</h3>
          {profilePicture ? (
            <img
              onClick={isEditingPicture ? handleSelectPicture : null}
              src={`http://localhost:8081/profileImages/${profilePicture}`}
              alt="Profile Picture"
              className="rounded-full w-60 object-cover"
            />
          ) : (
            <FontAwesomeIcon
              onClick={isEditingPicture ? handleSelectPicture : null}
              icon={faCircleUser}
              className="text-[250px]"
            />
          )}

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />

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
                    type="button"
                    onClick={handleSavePicture}
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
                  Change Profile Picture
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
