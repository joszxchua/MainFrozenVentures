import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const capitalizeFirstChar = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.post(
          "http://localhost:8081/admin/fetchAllAccounts"
        );
        if (usersResponse.data.status === "success") {
          setUsers(usersResponse.data.users);
          setFilteredUsers(usersResponse.data.users); // Initialize filteredUsers with all users
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentFilter === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (user) => user.userRole.toLowerCase() === currentFilter.toLowerCase()
        )
      );
    }
  }, [currentFilter, users]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  return (
    <>
      <div className="flex gap-3 text-4xl font-bold">
        <FontAwesomeIcon icon={faList} />
        <h2>User List</h2>
      </div>

      <div className="relative min-h-[70vh] max-h-[70vh] overflow-auto">
        <div className="mt-5 flex gap-5">
          {["All", "Admin", "Retailer", "Distributor", "Manufacturer"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`w-fit px-3 py-1 rounded-md border-2 font-bold text-lg ${
                  currentFilter === filter
                    ? "bg-purple-200 text-white border-purple-200"
                    : "bg-white text-purple-200 border-purple-200 hover:bg-purple-200 duration-300 hover:text-white ease-in-out"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.accountID}
              className="bg-gray-100 mt-5 px-4 py-3 rounded-lg"
            >
              <div className="bg-white flex items-center px-4 py-3 rounded-lg">
                {user.profilePicture ? (
                  <img
                    src={`http://localhost:8081/profileImages/${user.profilePicture}`}
                    alt="User Profile"
                    className="w-[70px] h-[70px] rounded-2xl"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="w-[70px] h-[70px]"
                  />
                )}

                <div className="w-full flex justify-between gap-1 px-5">
                  <div className="w-full">
                    <h3 className="font-bold text-xl">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p>{capitalizeFirstChar(user.userRole)}</p>
                  </div>

                  <div className="w-full text-lg">
                    <p>
                      <span className="font-semibold">Gender: </span>
                      {capitalizeFirstChar(user.gender)}
                    </p>

                    <p>
                      <span className="font-semibold">Birthdate: </span>
                      {formatDate(user.birthdate)}
                    </p>
                  </div>

                  <div className="w-full text-lg">
                    <p>
                      <span className="font-semibold">Email: </span>
                      {user.email}
                    </p>

                    <p>
                      <span className="font-semibold">Phone: </span>
                      {user.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-3">
            <h2 className="text-4xl font-bold">No Users</h2>
            <p className="text-lg text-center">
              No users found based on the selected filter
            </p>
          </div>
        )}
      </div>
    </>
  );
};
