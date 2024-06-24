import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";

export const SignIn = ({ createClick }) => {
  const { addUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const onSubmit = (data) => {
    setIsSigningIn(true);
    axios
      .post("http://localhost:8081/account/accountSignIn", data)
      .then((response) => {
        if (response.data.status === 1) {
          setMessageTitle("Success");
          setMessage(response.data.message);
          addUser(
            response.data.user.accountID,
            response.data.user?.shopID,
            response.data.user.userRole,
            response.data.user?.isVerified
          );
          
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          setMessageTitle("Error");
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Sign-up error:", error);
      })
      .finally(() => {
        setIsSigningIn(false);
      });

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  return (
    <>
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
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
              disabled={isSigningIn}
              className="text-lg px-3 py-1 rounded-md border-2 bg-purple-200 w-40 text-white border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
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
