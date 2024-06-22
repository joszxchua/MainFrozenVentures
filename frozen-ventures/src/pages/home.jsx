import React from "react";
import Bg from "../assets/home-bg.jpg";
import { Products } from "../components/products";

export const Home = () => {
  return (
    <div className="mt-20">
      {/* HERO SECTION */}
      <div className="relative">
        <img
          src={Bg}
          alt="Home Background"
          className="w-screen h-[70vh] object-cover blur-[1px] brightness-75"
        />
        <div className="absolute inset-0 flex flex-col pl-20 justify-center items-start">
          <h2 className="font-inter font-bold text-6xl text-white w-[600px]">
            Your Gateway to Delightful Ice Cream
          </h2>
          <p className="mt-3 font-inter text-lg text-white">
            Connecting You to the Finest Ice Cream Delights - Taste the Magic in
            Every Scoop!
          </p>
          <button className="mt-5 font-inter font-bold text-xl text-white bg-purple-200 px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
            Shop Now
          </button>
        </div>
      </div>

      {/* FEATURED SECTION */}
      <div className="py-20">
        <div className="flex flex-col items-center">
          <h2 className="font-inter font-bold text-5xl">Featured Products</h2>
          <p className="mt-3 font-inter text-lg">Surpise your taste buds with our ice cream!</p>
        </div>

        <div className="flex pt-14 justify-between px-40">
          <Products />
          <Products />
          <Products />
          <Products />
        </div>
      </div>
    </div>
  );
};
