import React from "react";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate("/");
  };

  const handleShopClick = () => {
    navigate("/shop");
  };

  return (
    <div className="fixed top-0 left-0 p-5 bg-white w-full flex justify-between z-50">
      <div
        onClick={handleTitleClick}
        className="flex items-center gap-x-2 cursor-pointer hover:text-purple-200 duration-300 ease-in-out"
      >
        <img src={logo} alt="Logo" className="w-9" />
        <h1 className="font-inter font-bold text-2xl">FrozenVentures</h1>
      </div>

      <div className="flex items-center gap-6">
        <p
          onClick={handleShopClick}
          className="font-inter font-bold text-lg cursor-pointer hover:text-purple-200 duration-300 ease-in-out"
        >
          Shop
        </p>
        <p className="font-inter font-bold text-lg cursor-pointer hover:text-purple-200 duration-300 ease-in-out">
          Cart
        </p>
        <button className="bg-purple-200 text-white font-inter font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
          Sign In
        </button>
      </div>
    </div>
  );
};
