import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const Restock = ({
  productInfo,
  sizeInfo,
  cancelRestock,
  onSuccess,
  onError,
}) => {
  const [stock, setStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStockChange = (e) => {
    setStock(e.target.value);
  };

  const handleRestockClick = () => {
    setIsLoading(true);
    try {
      const response = axios.post(
        "http://localhost:8081/product/productRestock",
        { sizeId: sizeInfo.sizeID, stock: stock }
      );
      if (response.data.status === "success") {
        onSuccess("Success", response.data.message);
      } else if (response.data.status === "error") {
        onError("Error", response.data.message);
      }
    } catch (error) {
      onError("Error", "Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 bg-white p-10 rounded-lg max-h-[80vh] overflow-auto">
      <div className="relative text-3xl">
        <h2 className="font-bold">Restock Product</h2>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={cancelRestock}
          className="absolute top-0 right-0 shadow-2xl cursor-pointer"
        />
      </div>

      <div className="flex gap-10">
        <img
          src={`http://localhost:8081/productImages/${productInfo.productImage}`}
          alt="Product Info"
          className="w-[250px] rounded-lg"
        />

        <div className="flex flex-col justify-around pr-10">
          <div>
            <h3 className="font-bold text-3xl">{productInfo.name}</h3>
            <p className="text-gray-200">{productInfo.brand}</p>
          </div>

          <p className="text-xl">
            <span className="font-bold">Flavor: </span> {productInfo.flavor}
          </p>

          <p className="text-xl">
            <span className="font-bold">Size: </span> {sizeInfo.size}
          </p>

          <p className="text-xl">
            <span className="font-bold">Current Stocks: </span> {sizeInfo.stock}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-xl px-20">
        <label className="font-semibold">Stock:</label>
        <input
          type="number"
          value={stock}
          onChange={handleStockChange}
          className="px-3 py-1 border-[1px] border-gray-200 rounded-[5px] outline-purple-200"
        />
      </div>

      <div className="mt-5 flex justify-around">
        <button
          onClick={cancelRestock}
          className="font-bold px-4 py-2 bg-gray-200 border-2 border-gray-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-gray-200 duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleRestockClick}
          className="font-bold px-4 py-2 bg-purple-200 border-2 border-purple-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-purple-200 duration-300"
        >
          Restock
        </button>
      </div>
    </div>
  );
};
