import React from "react";
import Blueberry from "../assets/flavors/Blueberry.jpg";
import cartLogo from "../assets/cart.png";
import IceCream from "../assets/ice-cream.png";

export const Products = () => {
  return (
    <div className="flex flex-col w-fit">
      <div className="relative">
        <img
          src={Blueberry}
          alt="Product Image"
          className="w-[300px] rounded-2xl"
        />
        <img
          src={cartLogo}
          alt="CartLogo"
          className="absolute bottom-5 right-5 w-[40px] bg-white p-1 rounded-sm cursor-pointer"
        />
      </div>

      <div className="font-inter mt-4">
        <div>
          <h3 className="font-bold text-xl">Product Name</h3>
          <p className="text-gray-200">Shop Name</p>
        </div>

        <div className="my-2">STARS</div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <img src={IceCream} alt="IceCreamLogo" className="w-[20px]" />
            <p className="text-sm text-gray-200">13 Items Left</p>
          </div>

          <p className="font-bold text-xl">Php 79.99</p>
        </div>
      </div>
    </div>
  );
};
