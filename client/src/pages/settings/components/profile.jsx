import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserContext } from "../../../context/user-context";

export const Profile = () => {
  const { user } = useContext(UserContext);
  const { register, handleSubmit, setValue } = useForm();
  const [isEditingPersonal, setIsEditingPersonal] = useState(null);

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

            const birthdate = new Date(userData.birthdate)
              .toISOString()
              .split("T")[0];

            setValue("firstName", userData.firstName);
            setValue("lastName", userData.lastName);
            setValue("gender", userData.gender);
            setValue("birthdate", birthdate);
            setValue("street", userData.street);
            setValue("municipality", userData.municipality);
            setValue("barangay", userData.barangay);
            setValue("province", userData.province);
            setValue("zipCode", userData.zipCode);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId, setValue]);

  const handleEditPersonalInfo = (e) => {
    e.preventDefault();
    setIsEditingPersonal(true);
  };

  const handleCancelEdit = () => {
    setIsEditingPersonal(false);
  };

  const onSubmit = (data) => {
    console.log(data);
    setIsEditingPersonal(false);
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Profile</h2>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">
            Personal Information
          </p>
          <div className="w-full border-t-2"></div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-5 py-5"
        >
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="firstName" className="text-lg font-medium">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("firstName")}
              disabled={!isEditingPersonal}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="lastName" className="text-lg font-medium">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("lastName")}
              disabled={!isEditingPersonal}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="gender" className="text-lg font-medium">
              Gender:
            </label>
            <input
              type="text"
              name="gender"
              id="gender"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("gender")}
              disabled={!isEditingPersonal}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="birthdate" className="text-lg font-medium">
              Birthdate:
            </label>
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("birthdate")}
              disabled={!isEditingPersonal}
            />
          </div>

          {isEditingPersonal ? (
            <div className="w-full flex justify-around">
              <button
                type="button"
                onClick={handleCancelEdit}
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
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleEditPersonalInfo}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Edit Personal Information
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="mt-20">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">
            Address Information
          </p>
          <div className="w-full border-t-2"></div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-5 py-5"
        >
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="street" className="text-lg font-medium">
              Street:
            </label>
            <input
              type="text"
              name="street"
              id="street"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("street")}
              readOnly
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="municipality" className="text-lg font-medium">
              Municipality:
            </label>
            <input
              type="text"
              name="municipality"
              id="municipality"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("municipality")}
              readOnly
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="barangay" className="text-lg font-medium">
              Barangay:
            </label>
            <input
              type="text"
              name="barangay"
              id="barangay"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("barangay")}
              readOnly
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="province" className="text-lg font-medium">
              Province:
            </label>
            <input
              type="text"
              name="province"
              id="province"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("province")}
              readOnly
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="zipCode" className="text-lg font-medium">
              Zip Code:
            </label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...register("zipCode")}
              readOnly
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Edit Address Information
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
