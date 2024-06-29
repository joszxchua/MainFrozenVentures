import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";

export const SellerProducts = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/product/sellerProductFetch",
            {
              accountId: user.accountId,
            }
          );
          if (response.data.status === 1) {
            const productsData = response.data.products;
            setProducts(
              Array.isArray(productsData) ? productsData : [productsData]
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId]);

  return (
    <>
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col w-fit cursor-pointer px-4 py-3 rounded-lg shadow-none hover:shadow-2xl transition-shadow duration-300 ease-in-out"
          >
            <img
              src={`http://localhost:8081/productImages/${product.productImage}`}
              alt="Product Image"
              className="w-[270px] rounded-2xl"
            />

            <div className="font-inter mt-4 flex flex-col gap-1">
              <div>
                <h3 className="font-bold text-xl">{product.name}</h3>
                <p className="text-gray-200">{product.brand}</p>
              </div>

              <p className="text-lg">
                <span className="font-semibold">Flavor: </span>
                {product.flavor}
              </p>

              <div className="flex justify-between items-end">
                <p className="text-lg">
                  <span className="font-semibold">Available Sizes:</span>{" "}
                  {product.totalSizes}
                </p>
                <p className="text-gray-200">{product.totalStock} Items Left</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-3">
          <h2 className="text-4xl font-bold">No Products</h2>
          <p className="text-lg text-center">
            Now, you can effortlessly add your products, including your ice
            cream flavors, to your inventory!
          </p>
        </div>
      )}
    </>
  );
};
