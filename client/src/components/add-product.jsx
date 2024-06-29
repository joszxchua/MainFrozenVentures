import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIceCream, faXmark } from "@fortawesome/free-solid-svg-icons";

export const AddProduct = ({ cancelAddProduct }) => {
  const { user } = useContext(UserContext);
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSelectImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setProductImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-white p-10 rounded-lg max-h-[80vh] overflow-auto">
      <div className="relative text-4xl">
        <h2 className="font-bold">Add A Product</h2>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={cancelAddProduct}
          className="absolute top-0 right-0 shadow-2xl cursor-pointer"
        />
      </div>
      <form>
        <div className="flex flex-col gap-5 items-center justify-center">
          {productImagePreview ? (
            <img
              onClick={handleSelectImage}
              src={productImagePreview}
              alt="Product Image"
              className="rounded-lg w-60 h-60 object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faIceCream}
              onClick={handleSelectImage}
              className="w-[200px] h-[200px] p-5 text-purple-200 shadow-2xl cursor-pointer rounded-lg"
            />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={handleSelectImage}
            className="font-bold px-4 py-2 bg-purple-200 border-2 border-purple-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-purple-200 duration-300"
          >
            Select Image
          </button>
        </div>

        <div className="w-full mt-5 grid grid-cols-[400px_400px] gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Product Name:</label>
              <input
                type="text"
                name="productName"
                id="productName"
                className="px-3 py-1 border-2 border-black rounded-lg w-full outline-purple-200"
              />
            </div>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Product Brand:</label>
              <input
                type="text"
                name="productBrand"
                id="productBrand"
                className="px-3 py-1 border-2 border-black rounded-lg w-full outline-purple-200"
              />
            </div>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Flavor:</label>
              <input
                type="text"
                name="flavor"
                id="flavor"
                className="px-3 py-1 border-2 border-black rounded-lg w-full outline-purple-200"
              />
            </div>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Size:</label>
              <div className="flex gap-5">
                <input
                  type="text"
                  name="size"
                  id="size"
                  className="px-3 py-1 border-2 border-black rounded-lg w-full outline-purple-200"
                />
                <select
                  name="size"
                  id="size"
                  className="px-3 py-1 border-2 border-black rounded-lg w-full outline-purple-200"
                >
                  <option value="">Select Size</option>
                  <option value="oz">Oz</option>
                  <option value="cup">Cup</option>
                  <option value="pint">Pint</option>
                  <option value="quart">Quart</option>
                  <option value="gallon">Gallon</option>
                  <option value="lbs">Lbs</option>
                  <option value="liters">Liters</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Product Description:</label>
              <textarea
                type="text"
                name="productDescription"
                id="productDescription"
                className="h-[135px] px-3 py-1 border-2 border-black rounded-lg resize-none w-full outline-purple-200"
              />
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col gap-2 text-xl">
                <label className="font-semibold">Product Price:</label>
                <input
                  type="text"
                  name="productPrice"
                  id="productPrice"
                  className="px-3 py-1 border-2 border-black rounded-lg w-full outline-purple-200"
                />
              </div>
              <div className="flex flex-col gap-2 text-xl">
                <label className="font-semibold">Stock:</label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  className="px-3 py-1 border-2 border-black rounded-lg w-full outline-purple-200"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xl">
              <label className="font-semibold">Allergens:</label>
              <input
                type="text"
                name="allergens"
                id="allergens"
                className="px-3 py-1 border-2 border-black rounded-lg w-full outline-purple-200"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-around">
          <button
            onClick={cancelAddProduct}
            className="font-bold px-4 py-2 bg-gray-200 border-2 border-gray-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-gray-200 duration-300"
          >
            Cancel
          </button>
          <button className="font-bold px-4 py-2 bg-purple-200 border-2 border-purple-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-purple-200 duration-300">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};
