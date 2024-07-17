import React from "react";
import ShopOne from "../assets/Shop1.png";
import ShopTwo from "../assets/Shop2.png";
import { Products } from "../components/products";

export const Shop = () => {
  return (
    <div className="mt-20">
      <div className="h-[500px] grid grid-cols-4 gap-4 items-center">
        <div className="relative">
          <img
            src={ShopOne}
            alt="Shop"
            className="absolute top-[-300px] left-7 w-[500px] z-20"
          />
          <div className="absolute top-[-250px] left-[120px] w-[300px] h-[500px] rounded-lg bg-purple-200 z-10"></div>
        </div>

        <div className="font-inter mt-5">
          <h2 className="font-bold text-5xl">Ice Cream</h2>
          <p className="mt-3 w-[600px] text-xl text-justify">
            Indulge in the finest flavors from around the globe with
            FrozenVentures. Experience premium quality, unique selections, and
            the convenience of doorstep delivery. Treat yourself to the ultimate
            ice cream delight today!
          </p>
        </div>

        <div className="col-span-2 relative mt-5">
          <img
            src={ShopTwo}
            alt="Shop"
            className="absolute top-[-240px] right-[220px] w-[300px] z-20"
          />
          <div className="absolute top-[-40px] right-[120px] w-[650px] h-[250px] rounded-lg bg-purple-100 z-10"></div>
        </div>
      </div>

      <div className="p-20 pb-10 items-start font-inter">
        <h3 className="text-4xl font-bold">Shop</h3>
        <p className="mt-2 text-lg">
          Discover a world of premium ice cream flavors!
        </p>
        <button className="mt-5 bg-purple-200 w-[100px] text-white font-inter font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
          Filter
        </button>
      </div>

      <div className="m-auto px-20 pb-20 flex flex-wrap gap-5">
        <Products />
      </div>
    </div>
  );
};
