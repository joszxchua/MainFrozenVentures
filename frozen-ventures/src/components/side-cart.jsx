import React, { forwardRef } from "react";
import Blueberry from "../assets/flavors/Blueberry.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

export const SideCart = forwardRef(({ closeSideCart, cartClick }, ref) => {
  return (
    <div
      ref={ref}
      className="p-10 fixed font-inter right-0 w-[500px] h-screen bg-white"
    >
      <div className="flex justify-between items-start">
        <h2 className="font-bold text-4xl">Cart</h2>
        <FontAwesomeIcon
          icon={faXmark}
          className="text-3xl cursor-pointer"
          onClick={closeSideCart}
        />
      </div>

      <div className="h-full flex flex-col justify-between">
        <div className="py-10">
          <div className="relative flex items-center gap-10">
            <img
              src={Blueberry}
              alt="Product"
              className="w-[120px] rounded-lg"
            />

            <div>
              <h3 className="font-bold text-xl">Product Name</h3>
              <p className="text-gray-200">Shop Name</p>
              <p className="text-gray-200">
                <strong>Flavor:</strong> flavor
              </p>
              <p className="text-gray-200">
                <strong>Size:</strong> size
              </p>
            </div>

            <FontAwesomeIcon
              icon={faTrash}
              className="absolute top-0 right-0 text-2xl cursor-pointer"
            />
          </div>

          <div className="py-4 flex justify-between text-lg">
            <p>Php 120.00</p>

            <div className="flex gap-10 items-center">
              <FontAwesomeIcon
                icon={faMinus}
                className="text-xl cursor-pointer"
              />

              <p>2</p>

              <FontAwesomeIcon
                icon={faPlus}
                className="text-xl cursor-pointer"
              />
            </div>

            <p className="font-bold">Php 240.00</p>
          </div>
        </div>

        <div className="border-t-2 py-10 flex justify-between">
          <button
            onClick={cartClick}
            className="font-bold text-lg px-3 py-1 bg-white text-purple-200 rounded-md border-2 border-purple-200 hover:text-white hover:bg-purple-200 duration-300 ease-in-out"
          >
            View Cart
          </button>
          <button className="font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out">
            <strong>Checkout:</strong> Php 240.00
          </button>
        </div>
      </div>
    </div>
  );
});
