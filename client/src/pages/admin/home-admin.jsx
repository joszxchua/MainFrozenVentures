import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/user-context";
import { Dashboard } from "./components/dashboard";
import { DocumentsVerification } from "./components/documents-verification";
import { UserList } from "./components/user-list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faFile, faList } from "@fortawesome/free-solid-svg-icons";

export const HomeAdmin = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [shopData, setShopData] = useState([]);

  const handleDashboardClick = () => {
    setActiveTab("dashboard");
  };

  const handleDocumentsVerificationClick = () => {
    setActiveTab("documents-verification");
  };

  const handleUserListClick = () => {
    setActiveTab("user-list");
  };

  return (
    <div className="mt-20 grid grid-cols-[25%_75%] font-inter">
      <div className="p-5">
        <div className="rounded-lg shadow-2xl p-8">
          <div>
            <h2 className="text-4xl font-bold">Admin</h2>
            <p className="text-lg text-gray-200">
              Manage your documents and users
            </p>
          </div>

          <ul className="flex flex-col gap-4 pt-10 font-bold text-2xl">
            <li
              onClick={handleDashboardClick}
              className={`${
                activeTab === "dashboard" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-3" />
              Dashboard
            </li>
            <li
              onClick={handleDocumentsVerificationClick}
              className={`${
                activeTab === "documents-verification"
                  ? "text-purple-200"
                  : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faFile} className="mr-3" />
              Documents Verification
            </li>
            <li
              onClick={handleUserListClick}
              className={`${
                activeTab === "user-list" ? "text-purple-200" : "text-gray-900"
              } cursor-pointer hover:bg-purple-200 hover:text-white rounded-lg p-3 duration-300 ease-in-out`}
            >
              <FontAwesomeIcon icon={faList} className="mr-3" />
              User List
            </li>
          </ul>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-lg shadow-2xl p-8">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "documents-verification" && <DocumentsVerification />}
          {activeTab === "user-list" && <UserList />}
        </div>
      </div>
    </div>
  );
};
