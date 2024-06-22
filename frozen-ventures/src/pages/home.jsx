import React from "react";
import Bg from "../assets/home-bg.jpg";
import MoreFlavors from "../assets/MoreFlavors.png";
import { Products } from "../components/products";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate("/shop");
  };

  return (
    <div className="mt-20 overflow-hidden">
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
          <button
            onClick={handleShopClick}
            className="mt-5 font-inter font-bold text-xl text-white bg-purple-200 px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* FEATURED SECTION */}
      <div className="py-20">
        <div className="flex flex-col items-center">
          <h2 className="font-inter font-bold text-5xl">Featured Products</h2>
          <p className="mt-3 font-inter text-lg">
            Surpise your taste buds with our ice cream!
          </p>
        </div>

        <div className="flex pt-14 justify-between px-40">
          <Products />
          <Products />
          <Products />
          <Products />
        </div>
      </div>

      {/* MORE FLAVORS SECTION */}
      <div className="relative flex flex-col justify-center h-[60vh] pt-20">
        <div className="font-inter bg-purple-200 text-white py-[120px] pl-40">
          <h2 className="font-bold text-5xl">Need More Flavors?</h2>
          <p className="mt-1 text-xl w-[700px]">
            Explore our extensive product catalog for a diverse range of
            delicious flavors, from classic favorites to innovative creations.{" "}
          </p>
          <button
            onClick={handleShopClick}
            className="mt-6 font-bold text-lg px-3 py-1 bg-white text-purple-200 rounded-md border-2 border-white hover:text-white hover:bg-purple-200 duration-300 ease-in-out"
          >
            More Flavors
          </button>
        </div>

        <img
          src={MoreFlavors}
          alt="MoreFlavors"
          className="absolute top-[-150px] left-[900px] w-[800px] rotate-[-40deg]"
        />
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="py-20 px-40 flex flex-col items-center font-inter">
        <div className="text-center">
          <h2 className="font-bold text-5xl">How It Works</h2>
          <p className="mt-3 text-lg w-[500px]">
            At FrozenVentures, we streamline the ice cream supply chain for
            everyone involved:
          </p>
        </div>

        <div className="flex gap-40 w-full mt-20">
          <div className="flex flex-col gap-2 p-12 bg-purple-200 text-white rounded-md">
            <h3 className="font-bold text-4xl">Customers</h3>
            <p>
              <strong>Explore & Buy:</strong> Browse and purchase ice cream from
              various retailers.
            </p>
            <p>
              <strong>Delivery:</strong> Get your favorite flavors delivered to
              your door.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-12 border-4 border-black text-black rounded-md">
            <h3 className="font-bold text-4xl">Retailers</h3>
            <p>
              <strong>Stock Up:</strong> Purchase from distributors to maintain
              a variety of products.
            </p>
            <p>
              <strong>Sell & Manage:</strong> Offer ice cream to customers and
              handle orders with ease.
            </p>
          </div>
        </div>

        <div className="flex gap-40 justify-end w-full mt-10 p-5">
          <div className="flex flex-col gap-2 p-12 border-4 border-black text-black rounded-md">
            <h3 className="font-bold text-4xl">Distributors</h3>
            <p>
              <strong>Source & Supply:</strong> Purchase from distributors to
              maintain a variety of products.
            </p>
            <p>
              <strong>Expand:</strong> Connect with more retailers through our
              platform.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-12 bg-purple-200 text-white rounded-md">
            <h3 className="font-bold text-4xl">Manufacturers</h3>
            <p>
              <strong>Produce & Partner:</strong> Create quality ice cream and
              sell to distributors.
            </p>
            <p>
              <strong>Innovate:</strong> Use market feedback to enhance your
              products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
