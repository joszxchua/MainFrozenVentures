import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { useParams } from "react-router-dom";

export const ManageProduct = () => {
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState({});
  const [sizes, setSizes] = useState([]);
  const { productId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/product/productFetch",
            {
              accountId: user.accountId,
              productId: productId,
            }
          );
          if (response.data.status === 1) {
            const productData = response.data.product;
            setProduct(productData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId, productId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/product/productSizesFetch",
            {
              productId: productId,
            }
          );
          if (response.data.status === 1) {
            const sizesData = response.data.products;
            setSizes(Array.isArray(sizesData) ? sizesData : [sizesData]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId]);

  return (
    <div className="mt-20 font-inter px-10 pb-10">
      <h1 className="text-5xl font-bold">Manage Product</h1>

      <div className="mt-10 flex gap-20">
        <div className="w-full">
          <div className="flex gap-5">
            <img
              src={`http://localhost:8081/productImages/${product.productImage}`}
              alt="Product Image"
              className="w-[300px] rounded-2xl"
            />

            <div className="w-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-semibold">{product.name}</h2>
                <p className="text-gray-200 text-xl">{product.brand}</p>
              </div>

              <p className="text-2xl">
                <span className="font-bold">Flavor:</span> {product.flavor}
              </p>

              <p className="text-2xl">
                <span className="font-bold">Allergens:</span>{" "}
                {product.allergens}
              </p>

              <p className="text-justify text-xl">{product.description}</p>

              <div className="flex justify-end">
                <button className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
                  Edit Product
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-lg shadow-2xl p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">Product Sizes</h2>
              <button className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
                Add Product Size
              </button>
            </div>

            {sizes.length > 0 ? (
              <div className="p-5">
                <div className="flex justify-between text-center text-2xl font-bold">
                  <p className="w-full">Size</p>
                  <p className="w-full">Price</p>
                  <p className="w-full">Stocks</p>
                </div>
                {sizes.map((size) => (
                  <div
                    key={size.sizeID}
                    className="flex justify-between text-center text-xl border-t py-5 mt-5"
                  >
                    <p className="w-full">{size.size}</p>
                    <p className="w-full">Php {size.price}</p>
                    <p className="w-full">{size.stock} items left</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No sizes available</p>
            )}
          </div>
        </div>

        <div className="w-[50%]  rounded-lg p-10 shadow-2xl">
          <h2 className="text-3xl font-semibold border-b-2 pb-5 mb-5">
            Reviews
          </h2>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <img
                src={`http://localhost:8081/productImages/${product.productImage}`}
                alt="Product Image"
                className="w-[50px] h-[50px] rounded-full"
              />

              <div className="w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Pedro Mapagmahal</h3>
                  <p>
                    <span className="font-semibold">Rating:</span> 3/5
                  </p>
                </div>

                <p className="text-justify">
                  I absolutely love this vanilla ice cream! The flavor is
                  incredibly rich and authentic, with just the right amount of
                  sweetness. The texture is smooth and creamy, making every bite
                  a delight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
