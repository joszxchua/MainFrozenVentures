import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faStar,
  faIceCream,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "rgb(123, 106, 194)" : provided.borderColor,
    boxShadow: state.isFocused
      ? "0 0 0 1px rgb(123, 106, 194)"
      : provided.boxShadow,
  }),
};

export const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [activeDescRev, setActiveDescRev] = useState("description");

  useEffect(() => {
    const fetchData = async () => {
      if (productId) {
        try {
          const productResponse = await axios.post(
            "http://localhost:8081/product/productFetch",
            { productId: productId }
          );
          if (productResponse.data.status === 1) {
            setProduct(productResponse.data.product);
          }

          const sizesResponse = await axios.post(
            "http://localhost:8081/product/productSizesFetch",
            { productId }
          );
          if (sizesResponse.data.status === 1) {
            setSizes(sizesResponse.data.products);

            const lowestPriceOption = sizesResponse.data.products.reduce(
              (min, size) => (size.price < min.price ? size : min),
              sizesResponse.data.products[0]
            );
            setSelectedSize({
              label: lowestPriceOption.size,
              value: lowestPriceOption,
            });
            setPrice(lowestPriceOption.price);
            setStock(lowestPriceOption.stock);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [productId]);

  const handleReturnShop = () => {
    navigate("/shop");
  };

  const handleSizeChange = (selectedOption) => {
    setSelectedSize(selectedOption);
    setPrice(selectedOption.value.price);
    setStock(selectedOption.value.stock);
  };

  const handleDescriptionClick = () => {
    setActiveDescRev("description");
  };

  const handleReviewsClick = () => {
    setActiveDescRev("reviews");
  };

  return (
    <div className="mt-20 mb-10 pb-10 min-h-[70vh] flex justify-center gap-36">
      <div className="flex flex-col gap-5">
        <div
          onClick={handleReturnShop}
          className="flex items-center gap-3 text-xl cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <p className="font-semibold">Return to shop</p>
        </div>

        <img
          src={`http://localhost:8081/productImages/${product.productImage}`}
          alt="Product"
          className="rounded-lg w-[500px]"
        />
      </div>

      <div className="flex flex-col justify-between w-[30vw]">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-4xl">{product.name}</h2>
              <p className="text-xl text-gray-200">{product.shopName}</p>
            </div>

            <div className="flex gap-2">
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
          </div>

          <div className="flex justify-between items-center text-xl">
            <p>
              <span className="font-bold">Flavor:</span> {product.flavor}
            </p>
            <p>
              <span className="font-bold">Brand:</span> {product.brand}
            </p>
            <p className="font-bold text-2xl text-right">
              Php {price.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Select
              className="w-full"
              styles={customStyles}
              value={selectedSize}
              onChange={handleSizeChange}
              options={sizes.map((size) => ({
                label: size.size,
                value: size,
              }))}
            />
            <p className="w-full text-xl text-right text-gray-200">
              <FontAwesomeIcon icon={faIceCream} /> {stock} Items Left
            </p>
          </div>
        </div>

        <div className="my-5">
          <div className="flex justify-between pb-5 border-b-2 border-gray-200">
            <p
              onClick={handleDescriptionClick}
              className={`w-full font-semibold text-center text-lg ${
                activeDescRev === "description"
                  ? "text-purple-200"
                  : "text-gray-200"
              } cursor-pointer`}
            >
              Description
            </p>
            <p
              onClick={handleReviewsClick}
              className={`w-full font-semibold text-center text-lg ${
                activeDescRev === "reviews"
                  ? "text-purple-200"
                  : "text-gray-200"
              } cursor-pointer`}
            >
              Reviews
            </p>
          </div>

          {activeDescRev === "description" ? (
            <p className="p-5 text-xl text-justify">{product.description}</p>
          ) : (
            <div className="h-full flex items-center justify-center text-3xl gap-5">
              <p className="font-bold">No reviews yet</p>
              <FontAwesomeIcon icon={faScroll} className="text-purple-200" />
            </div>
          )}
        </div>

        <div className="mt-auto flex justify-between">
          <button className="font-bold text-lg px-3 py-1 bg-white text-purple-200 rounded-md border-2 border-purple-200 hover:text-white hover:bg-purple-200 duration-300 ease-in-out">
            Add to cart
          </button>
          <button className="font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out">
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};
