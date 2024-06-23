import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const SignIn = ({ createClick }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <>
      <div className="w-full flex flex-col">
        <form action="" className="flex flex-col justify-center gap-10">
          <div className="flex flex-col w-full">
            <label className="font-semibold text-xl" htmlFor="username">
              Email or Phone:
            </label>
            <input
              className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
              type="text"
              name="username"
            />
          </div>

          <div className="relative flex flex-col w-full">
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="absolute top-0 right-0 text-xl p-2 cursor-pointer text-gray-200"
              onClick={togglePasswordVisibility}
            />
            <label className="font-semibold text-xl" htmlFor="password">
              Password:
            </label>
            <input
              className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
              type={passwordVisible ? "text" : "password"}
              name="password"
            />
          </div>
        </form>

        <div className="mt-10 flex flex-col items-center justify-center gap-10">
          <p className="text-lg text-gray-200 cursor-pointer">
            Forgot password?
          </p>

          <button className="bg-purple-200 w-40 text-white font-inter font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
            Sign In
          </button>

          <p className="text-lg text-gray-200">
            Don't have an account? <span onClick={createClick} className="font-bold text-purple-200 cursor-pointer">Create your account</span>
          </p>
        </div>
      </div>
    </>
  );
};
