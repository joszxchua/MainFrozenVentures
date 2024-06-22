import React from "react";
import logo from "../assets/logo.jpg";

export const Footer = () => {
  return (
    <div className="border-t-2 p-12 flex justify-between">
      <div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-x-2 cursor-pointer hover:text-purple-200 duration-300 ease-in-out">
            <img src={logo} alt="Logo" className="w-9" />
            <h1 className="font-inter font-bold text-2xl">FrozenVentures</h1>
          </div>

          <p className="w-[700px] text-lg">
            Blends our love for ice cream with innovative distribution,
            dedicated to bringing you the finest flavors from around the globe.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-lg">Help</h4>
        <p>FAQs</p>
        <p>Privacy Policy</p>
        <p>Payment Policy</p>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-lg">Contact Us</h4>
        <p>frozenventures@icecream.com</p>
        <p>+63 9069420911</p>
      </div>
    </div>
  );
};
