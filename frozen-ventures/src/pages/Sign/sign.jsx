import React, { useState } from "react";
import { SignIn } from "./components/signin";
import { SignUp } from "./components/signup";
import { useNavigate } from "react-router-dom";
import SignBg from "../../assets/Sign.png";
import logo from "../../assets/logo.jpg";

export const Sign = () => {
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate("/");
  };

  const handleSignInClick = () => {
    setSignUp(false);
  };

  const handleSignUpClick = () => {
    setSignUp(true);
  };

  return (
    <div className="grid grid-cols-2">
      <div className="relative w-[50vw] h-screen grid place-items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-purple-200 opacity-70"></div>
          <img src={SignBg} alt="Sign" className="w-full h-full object-cover" />
        </div>

        <div className="z-10 px-10">
          <div
            onClick={handleTitleClick}
            className="flex items-center gap-x-2 cursor-pointer"
          >
            <img src={logo} alt="Logo" className="w-[90px]" />
            <h1 className="font-inter font-bold text-8xl text-white">
              FrozenVentures
            </h1>
          </div>
          <p className="text-white mt-4 text-xl text-justify">
            Welcome! We are delighted to have you here. At FrozenVentures, we
            strive to bring joy and satisfaction with every visit. Explore our
            wide variety of delicious offerings and experience the best in
            quality and service.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center h-screen font-inter">
        <div className="m-0 h-[25vh] flex items-center justify-between w-full font-bold text-4xl">
          <h2
            onClick={handleSignInClick}
            className={`w-full text-right pr-20 cursor-pointer ${
              !signUp ? "text-purple-200" : "text-gray-200"
            }`}
          >
            Sign In
          </h2>
          <h2
            onClick={handleSignUpClick}
            className={`w-full text-left pl-20 cursor-pointer ${
              signUp ? "text-purple-200" : "text-gray-200"
            }`}
          >
            Sign Up
          </h2>
        </div>

        {signUp ? <SignUp /> : <SignIn />}
      </div>
    </div>
  );
};
