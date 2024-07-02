import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faMagnifyingGlass,
  faChevronDown,
  faChevronUp,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

export const MyInventory = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user.accountId) {
        try {
          const productResponse = await axios.post(
            "http://localhost:8081/product/sellerProductFetch",
            { accountId: user.accountId }
          );
          if (productResponse.data.status === 1) {
            const productsData = productResponse.data.products;
            setProducts(
              Array.isArray(productsData) ? productsData : [productsData]
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user.accountId]);

  useEffect(() => {
    const fetchSizes = async () => {
      if (expandedProductId) {
        try {
          const sizesResponse = await axios.post(
            "http://localhost:8081/product/productSizesFetch",
            { productId: expandedProductId }
          );
          if (sizesResponse.data.status === 1) {
            const sizesData = sizesResponse.data.products;
            setSizes(Array.isArray(sizesData) ? sizesData : [sizesData]);
          }
        } catch (error) {
          console.error("Error fetching sizes:", error);
        }
      }
    };

    fetchSizes();
  }, [expandedProductId]);

  const handleShowSizes = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  const handleCloseSizes = () => {
    setExpandedProductId(null);
  };

  return (
    <>
      <div className="flex items-center">
        <div className="w-full flex gap-3 text-5xl font-bold">
          <FontAwesomeIcon icon={faCubes} />
          <h2>My Inventory</h2>
        </div>

        <div className="relative w-full flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute right-5 cursor-pointer"
          />
        </div>

        <div className="w-full"></div>
      </div>

      <div className="mt-10 min-h-[365px] font-inter">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.productID}
              className="bg-gray-100 mt-5 px-4 py-3 rounded-lg"
            >
              <div className="bg-white flex items-center px-4 py-3 rounded-lg">
                <img
                  src={`http://localhost:8081/productImages/${product.productImage}`}
                  alt="Product Image"
                  className="w-[70px] h-[70px] rounded-2xl"
                />

                <div className="w-full flex justify-between gap-1 px-5">
                  <div className="w-full">
                    <h3 className="font-bold text-xl">{product.name}</h3>
                    <p className="text-gray-200">{product.brand}</p>
                  </div>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Flavor: </span>
                    {product.flavor}
                  </p>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Available Sizes:</span>{" "}
                    {product.totalSizes}
                  </p>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Total Stocks:</span>{" "}
                    {product.totalStock} Items Left
                  </p>

                  <div>
                    {expandedProductId === product.productID ? (
                      <FontAwesomeIcon
                        onClick={handleCloseSizes}
                        icon={faChevronUp}
                        className="cursor-pointer"
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => handleShowSizes(product.productID)}
                        icon={faChevronDown}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
              {expandedProductId === product.productID && (
                <>
                  {sizes.map((size) => (
                    <div
                      className="flex flex-col items-end mt-3"
                      key={size.sizeID}
                    >
                      <div className="flex items-center bg-white w-[75%] px-3 py-2 rounded-lg">
                        <p className="w-full">
                          <span className="font-bold">Size: </span>
                          {size.size}
                        </p>
                        <p className="w-full">
                          <span className="font-bold">Stocks: </span>
                          {size.stock} Items Left
                        </p>
                        <div
                          className={`w-[35%] flex items-center gap-5 ${
                            size.stock <= 20
                              ? "bg-red-100  text-red-200 font-bold"
                              : "bg-green-100 text-green-200 font-bold"
                          } px-3 py-1 rounded-full`}
                        >
                          <FontAwesomeIcon icon={faCircle} />
                          <p>{size.stock <= 20 ? "Low Stock" : "In Stock"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
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
      </div>
    </>
  );
};
