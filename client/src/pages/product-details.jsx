import React from "react";
import { useParams } from "react-router-dom";
import Blueberry from "../assets/flavors/Blueberry.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";

export const ProductDetails = () => {
  const { productId } = useParams();
  return (
    <div className="mt-20 px-10 pb-10 font-inter">
      <div className="flex justify-center gap-36">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 text-xl cursor-pointer">
            <FontAwesomeIcon
              icon={faArrowLeft}
            />
            <p className="font-semibold">Return to shop</p>
          </div>

          <img src={Blueberry} alt="Product" className="rounded-lg w-[500px]" />
        </div>

        <div className="flex flex-col justify-between w-[30vw]">
          <div>
            <div>
              <h2 className="font-bold text-4xl">Product Name</h2>
              <p className="text-xl text-gray-200">Shop Name</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="py-5 flex gap-2">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-purple-200 text-3xl"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-purple-200 text-3xl"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-purple-200 text-3xl"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-gray-100 text-3xl"
                />
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-gray-100 text-3xl"
                />
              </div>
              <p className="font-semibold text-2xl">Php 120.00</p>
            </div>
          </div>

          <div className="py-5">
            <div className="flex justify-between pb-5 border-b-2 border-gray-200">
              <p className="w-full font-semibold text-center text-lg text-purple-200 cursor-pointer">
                Description
              </p>
              <p className="w-full font-semibold text-center text-lg text-gray-200 cursor-pointer">
                Ingredients
              </p>
              <p className="w-full font-semibold text-center text-lg text-gray-200 cursor-pointer">
                Reviews
              </p>
            </div>

            <p className="p-5 ">asdasdasda</p>
          </div>

          <div className="mt-auto flex justify-between">
            <button className="font-bold text-lg px-3 py-1 bg-white text-purple-200 rounded-md border-2 border-purple-200 hover:text-white hover:bg-purple-200 duration-300 ease-in-out">
              Add to cart
            </button>
            <button className="font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out">
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
