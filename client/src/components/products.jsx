import React from "react";
import { useNavigate } from "react-router-dom";
import Blueberry from "../assets/flavors/Blueberry.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIceCream,
  faCartPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

export const Products = () => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate("/product-details");
  };

  return (
    <div onClick={handleProductClick} className="flex flex-col w-fit">
      <div className="relative">
        <img src={Blueberry} alt="Product" className="w-[300px] rounded-2xl" />
        <FontAwesomeIcon
          icon={faCartPlus}
          className="absolute bottom-5 right-5 text-xl bg-white p-2 rounded-sm cursor-pointer"
        />
      </div>

      <div className="font-inter mt-4">
        <div>
          <h3 className="font-bold text-xl">Product Name</h3>
          <p className="text-gray-200">Shop Name</p>
        </div>

        <div className="py-5 flex gap-2">
          <FontAwesomeIcon icon={faStar} className="text-purple-200 text-3xl" />
          <FontAwesomeIcon icon={faStar} className="text-purple-200 text-3xl" />
          <FontAwesomeIcon icon={faStar} className="text-purple-200 text-3xl" />
          <FontAwesomeIcon icon={faStar} className="text-gray-100 text-3xl" />
          <FontAwesomeIcon icon={faStar} className="text-gray-100 text-3xl" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <FontAwesomeIcon icon={faIceCream} className="text-lg" />
            <p className="text-sm text-gray-200">13 Items Left</p>
          </div>

          <p className="font-bold text-xl">Php 79.99</p>
        </div>
      </div>
    </div>
  );
};
