import React from "react";
import Blueberry from "../assets/flavors/Blueberry.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export const Cart = () => {
  return (
    <div className="mt-20 h-[70vh] grid grid-cols-1 md:grid-cols-[70%_30%] px-10 pb-10">
      <div className="font-inter pb-10 mr-10">
        <h2 className="text-4xl font-bold mb-4">My Cart</h2>

        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Product</th>
                <th className="text-center py-2 w-[200px]">Flavor</th>
                <th className="text-center py-2 w-[150px]">Size</th>
                <th className="text-center py-2 w-[150px]">Price</th>
                <th className="text-center py-2 w-[150px]">Qty</th>
                <th className="text-center py-2 w-[200px]">Total</th>
                <th className="py-2 w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="relative">
                <td className="py-4 flex items-center">
                  <img
                    src={Blueberry}
                    alt="Product"
                    className="w-[150px] rounded-lg object-cover mr-5"
                  />
                  <div>
                    <h4 className="font-bold text-xl">Product Name</h4>
                    <p className="text-gray-200">Shop Name</p>
                  </div>
                </td>
                <td className="text-center">Toasted Almond</td>
                <td className="text-center">1 Gallon</td>
                <td className="text-center">Php 120.00</td>
                <td className="text-center">
                  <div className="flex justify-center gap-10 items-center">
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
                </td>
                <td className="text-center">Php 240.00</td>
                <td className="absolute top-5 right-5 text-xl cursor-pointer">
                  <FontAwesomeIcon icon={faTrash} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-100 p-10 rounded-lg flex flex-col h-full">
        <h2 className="text-4xl font-bold mb-4">Cart Summary</h2>

        <div>
          <div className="flex justify-between items-center font-semibold text-xl">
            <h4>Product Name</h4>
            <p>Php 240.00</p>
          </div>

          <p className="text-gray-200">Flavor, Size, x2</p>
        </div>

        <div className="mt-auto">
          <p className="flex justify-between font-semibold text-xl border-b pb-5 mb-5">
            <span className="font-bold">Total:</span> Php 240.00
          </p>

          <button className="w-full font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
