import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { OrderContext } from "../context/order-context";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import { SuccessMessage } from "../components/success-message";
import { ErrorMessage } from "../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faIceCream,
  faScroll,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "rgb(123, 106, 194)" : provided.borderColor,
    boxShadow: state.isFocused
      ? "0 0 0 1px rgb(123, 106, 194)"
      : provided.boxShadow,
  }),
};

export const ProductDetails = () => {
  const { user } = useContext(UserContext);
  const { setOrder, orderProducts, clearOrder } = useContext(OrderContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeId, setSizeId] = useState(null);
  const [size, setSize] = useState(null);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

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
            setSizeId(lowestPriceOption.sizeID);
            setSize(lowestPriceOption.size);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [productId]);

  useEffect(() => {
    const fetchData = async () => {
      if (productId) {
        try {
          const reviewsResponse = await axios.post(
            "http://localhost:8081/product/reviewFetch",
            { productId: productId }
          );
          if (reviewsResponse.data.status === 1) {
            const reviewsData = reviewsResponse.data.reviews;
            setReviews(reviewsData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [productId]);

  const handleSizeChange = (selectedOption) => {
    setSelectedSize(selectedOption);
    setPrice(selectedOption.value.price);
    setStock(selectedOption.value.stock);
    setSizeId(selectedOption.value.sizeID);
    setSize(selectedOption.label);
  };

  const handleQuantityChange = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (user?.accountId) {
      const userCart = {
        accountId: user?.accountId,
        productId: productId,
        sizeId: sizeId,
        quantity: quantity,
      };

      const response = await axios.post(
        "http://localhost:8081/cart/addToCart",
        userCart
      );

      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
      } else if (response.data.status === "error") {
        setMessageTitle("Error");
        setMessage(response.data.message);
      }
    } else {
      setMessageTitle("Error");
      setMessage("You need to be signed in first");
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleBuyNow = async () => {
    clearOrder();
    try {
      if (user.userRole === "retailer" || user.userRole === "distributor") {
        const minQuantity = user.userRole === "retailer" ? 50 : 100;
        if (quantity < minQuantity) {
          setMessageTitle("Error");
          setMessage(
            `${
              user.userRole.charAt(0).toUpperCase() + user.userRole.slice(1)
            }s must order at least ${minQuantity} units of each product.`
          );
          setTimeout(() => {
            setMessageTitle("");
            setMessage("");
          }, 3000);
          return;
        }
      }

      const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const orderDetails = {
        products: {
          [sizeId]: (() => {
            if (quantity > stock) {
              setMessageTitle("Error");
              setMessage(
                `Quantity for ${product.name} ${size} exceeds available stock`
              );
              throw new Error(
                `Quantity for ${product.name} ${size} exceeds available stock.`
              );
            }

            return {
              productId: productId,
              sizeId: sizeId,
              productImage: product.productImage,
              name: product.name,
              brand: product.brand,
              flavor: product.flavor,
              quantity: quantity,
              size: size,
              price: price,
              totalPrice: (quantity * price).toFixed(2),
              status: "Pending",
              orderDate: currentDate,
            };
          })(),
        },
      };

      setOrder(orderDetails);

      if (orderProducts) {
        navigate("/order");
      }
    } catch (error) {
      if (error.message.includes("exceeds available stock")) {
      } else {
        setMessageTitle("Error");
        setMessage("Something went wrong");
      }

      setTimeout(() => {
        setMessageTitle("");
        setMessage("");
      }, 3000);
    }
  };

  return (
    <>
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}

      <div className="my-20 pt-10 min-h-[70vh] flex justify-center gap-20">
        <div className="flex flex-col justify-between w-[30vw] p-10 rounded-lg shadow-2xl">
          <div className="h-full flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-4xl">{product.name}</h2>
                <p className="text-xl text-gray-200">{product.shopName}</p>
              </div>

              <div className="py-2 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-yellow-500 text-3xl"
                />
                <p className="text-xl">( {product.avgRating} / 5 )</p>
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

            <div className="flex items-end justify-between">
              <div className="w-full flex flex-col gap-2">
                <p className="font-bold text-xl">Size:</p>
                <Select
                  styles={customStyles}
                  value={selectedSize}
                  onChange={handleSizeChange}
                  options={sizes.map((size) => ({
                    label: size.size,
                    value: size,
                  }))}
                />
              </div>
              <p className="w-full text-xl text-right text-gray-200">
                <FontAwesomeIcon icon={faIceCream} /> {stock} Items Left
              </p>
            </div>
          </div>

          <div className="h-full my-10">
            <div className="flex justify-between pb-5 border-b-2 border-gray-200">
              <p className="w-full font-semibold text-center text-lg text-gray-200">
                Description
              </p>
            </div>

            <p className="py-5 text-xl text-justify leading-10">{product.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <img
            src={`http://localhost:8081/productImages/${product.productImage}`}
            alt="Product"
            className="rounded-lg w-[450px]"
          />

          <div className="h-full flex flex-col justify-around gap-5 p-7 rounded-lg shadow-2xl">
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold mb-2">Quantity:</p>
              <div className="flex justify-center items-center gap-5 text-lg">
                <FontAwesomeIcon
                  icon={faMinus}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="cursor-pointer"
                />
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border rounded outline-purple-200 px-2 py-1 text-center"
                />
                <FontAwesomeIcon
                  icon={faPlus}
                  onClick={() => setQuantity(quantity + 1)}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleAddToCart}
                className="font-bold text-lg px-3 py-1 bg-white text-purple-200 rounded-md border-2 border-purple-200 hover:text-white hover:bg-purple-200 duration-300 ease-in-out"
              >
                Add to cart
              </button>
              <button
                onClick={handleBuyNow}
                className="font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>

        <div className="ml-20 w-[25vw] max-h-[75vh] p-5 rounded-lg shadow-2xl overflow-auto">
          {reviews && reviews.length > 0 && <h3 className="mb-5 font-bold text-2xl">Reviews:</h3>}
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.reviewID} className="mb-5 flex flex-col">
                <div className="flex items-center gap-3">
                  <img
                    src={`http://localhost:8081/profileImages/${review.profilePicture}`}
                    alt={review.firstName + " " + review.lastName}
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="w-full flex justify-between">
                    <div>
                      <p className="font-semibold text-lg">
                        {review.firstName} {review.lastName}
                      </p>

                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-yellow-500"
                        />
                        <p className="text-sm">( {review.rating} / 5 )</p>
                      </div>
                    </div>

                    <p>{formatDate(review.createdAt)}</p>
                  </div>
                </div>

                {review.reviewText === "" ? (
                  <p className="mt-3 w-full">No feedback.</p>
                ) : (
                  <p className="mt-3 w-full break-words">{review.reviewText}</p>
                )}
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-3xl gap-5">
              <p className="font-bold">No reviews yet</p>
              <FontAwesomeIcon icon={faScroll} className="text-purple-200" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
