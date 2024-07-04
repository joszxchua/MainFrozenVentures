import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIceCream, faStar } from "@fortawesome/free-solid-svg-icons";

export const Products = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      let userRole;
      if (!user?.userRole || user.userRole === "customer") {
        userRole = "retailer";
      } else if (user.userRole === "retailer") {
        userRole = "distributor";
      } else if (user.userRole === "distributor") {
        userRole = "manufacturer";
      } else {
        userRole = user.userRole;
      }

      try {
        const response = await axios.post(
          "http://localhost:8081/product/productShopFetch",
          { userRole: userRole }
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [user]);

  const handleProductClick = (productID) => {
    navigate(`/product-details/${productID}`);
  };

  return (
    <>
      {products.map((product) => (
        <div
          key={product.productID}
          onClick={() => handleProductClick(product.productID)}
          className="flex flex-col w-fit cursor-pointer px-4 py-3 rounded-lg hover:shadow-2xl duration-300"
        >
          <img
            src={`http://localhost:8081/productImages/${product.productImage}`}
            alt="Product"
            className="w-[300px] rounded-2xl"
          />

          <div className="font-inter mt-4">
            <div>
              <h3 className="font-bold text-xl">{product.name}</h3>
              <p className="text-gray-200">{product.shopName}</p>
            </div>

            <div className="py-5 flex gap-2">
              <FontAwesomeIcon
                icon={faStar}
                className="text-purple-200 text-3xl"
              />
              <FontAwesomeIcon
                icon={faStar}
                className="text-purple-200 text-3xl"
              />
              <FontAwesomeIcon
                icon={faStar}
                className="text-purple-200 text-3xl"
              />
              <FontAwesomeIcon
                icon={faStar}
                className="text-gray-100 text-3xl"
              />
              <FontAwesomeIcon
                icon={faStar}
                className="text-gray-100 text-3xl"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center">
                <FontAwesomeIcon icon={faIceCream} className="text-lg" />
                <p className="text-sm text-gray-200">
                  {product.totalStock} Items Left
                </p>
              </div>

              <p className="font-bold text-xl">
                Php {product.lowestPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
