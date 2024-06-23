import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const SignIn = ({ createClick }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <>
      <div className="w-full flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-10"
        >
          <div className="flex flex-col w-full">
            <label className="font-semibold text-xl" htmlFor="username">
              Email or Phone:
            </label>
            <input
              {...register("username", { required: true })}
              className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                errors.username ? "border-red-500" : ""
              }`}
              type="text"
              name="username"
            />
            {errors.username && (
              <span className="text-red-500">This field is required</span>
            )}
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
              {...register("password", { required: true })}
              className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                errors.password ? "border-red-500" : ""
              }`}
              type={passwordVisible ? "text" : "password"}
              name="password"
            />
            {errors.password && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-10">
            <p className="text-lg text-gray-200 cursor-pointer">
              Forgot password?
            </p>

            <button
              type="submit"
              className="bg-purple-200 w-40 text-white font-inter font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Sign In
            </button>

            <p className="text-lg text-gray-200">
              Don't have an account?{" "}
              <span
                onClick={createClick}
                className="font-bold text-purple-200 cursor-pointer"
              >
                Create your account
              </span>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
