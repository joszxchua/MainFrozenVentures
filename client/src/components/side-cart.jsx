import React, { useContext, useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { OrderContext } from "../context/order-context";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { SuccessMessage } from "../components/success-message";
import { ErrorMessage } from "../components/error-message";
import { Confirmation } from "../components/confirmation";

export const SideCart = forwardRef(({ closeSideCart, cartClick }, ref) => {
  const { user } = useContext(UserContext);
  const { setOrder, orderProducts, clearOrder } = useContext(OrderContext);
  const [cartItems, setCartItems] = useState([]);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [removeCartId, setRemoveCartId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.accountId) {
        try {
          const cartResponse = await axios.post(
            "http://localhost:8081/cart/cartItemFetch",
            { accountId: user.accountId }
          );
          if (cartResponse.data.status === 1) {
            setCartItems(cartResponse.data.cart);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user?.accountId]);

  const handleQuantityChange = (cartID, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item, index) =>
        index === cartID ? { ...item, quantity: newQuantity } : item
      )
    );

    const updatedItem = cartItems[cartID];

    axios
      .post("http://localhost:8081/cart/updateQuantity", {
        accountId: user.accountId,
        cartId: updatedItem.cartID,
        quantity: newQuantity,
      })
      .then((response) => {
        if (response.data.status === "success") {
          setMessageTitle("Success");
          setMessage(response.data.message);
        } else {
          setMessageTitle("Error");
          setMessage("Something went wrong");
        }
      })
      .catch((error) => {
        setMessageTitle("Error");
        setMessage("Something went wrong");
      });

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleRemoveItem = (cartID, name, size) => {
    const removeItem = cartItems[cartID];
    setRemoveCartId(removeItem.cartID);
    setConfirmationTitle("Remove From Cart");
    setConfirmationMessage(
      `Are you sure you want to remove ${name} ${size} from your cart?`
    );
  };

  const handleCancelConfirmation = () => {
    setConfirmationTitle("");
    setConfirmationMessage("");
    setRemoveCartId(null);
  };

  const handleYesConfirmation = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/cart/removeFromCart",
        { accountId: user.accountId, cartId: removeCartId }
      );
      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cartID !== removeCartId)
        );
      } else {
        setMessageTitle("Error");
        setMessage("Something went wrong");
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("Something went wrong");
    }

    setConfirmationTitle("");
    setConfirmationMessage("");

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleCheckout = async () => {
    clearOrder();
    try {
      if (user.userRole === "retailer" || user.userRole === "distributor") {
        const minQuantity = user.userRole === "retailer" ? 50 : 100;
        const invalidProducts = cartItems.filter(
          (item) => item.quantity < minQuantity
        );
        if (invalidProducts.length > 0) {
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
        products: cartItems.reduce((acc, curr) => {
          if (curr.quantity > curr.stock) {
            setMessageTitle("Error");
            setMessage(
              `Quantity for ${curr.name} ${curr.size} exceeds available stock`
            );
            throw new Error(
              `Quantity for ${curr.name} ${curr.size} exceeds available stock.`
            );
          }

          acc[curr.sizeID] = {
            productId: curr.productID,
            sizeId: curr.sizeID,
            productImage: curr.productImage,
            name: curr.name,
            brand: curr.brand,
            flavor: curr.flavor,
            quantity: curr.quantity,
            size: curr.size,
            price: curr.price,
            totalPrice: (curr.quantity * curr.price).toFixed(2),
            status: "Pending",
            orderDate: currentDate,
          };
          return acc;
        }, {}),
      };

      setOrder(orderDetails);

      if (orderProducts) {
        closeSideCart();
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
    <div
      ref={ref}
      className="p-10 fixed font-inter right-0 w-[500px] h-screen bg-white"
    >
      <div className="flex justify-between items-start">
        <h2 className="font-bold text-4xl">Cart</h2>
        <FontAwesomeIcon
          icon={faXmark}
          className="text-3xl cursor-pointer"
          onClick={closeSideCart}
        />
      </div>

      <div className="flex flex-col justify-between ">
        <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto">
          {messageTitle && messageTitle === "Error" && (
            <ErrorMessage title={messageTitle} message={message} />
          )}
          {messageTitle && messageTitle === "Success" && (
            <SuccessMessage title={messageTitle} message={message} />
          )}
          {confirmationTitle && (
            <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-30">
              <Confirmation
                confirmationTitle={confirmationTitle}
                confirmationMessage={confirmationMessage}
                cancelConfirmation={handleCancelConfirmation}
                yesConfirmation={handleYesConfirmation}
              />
            </div>
          )}
          {cartItems.map((item, cartID) => (
            <div key={cartID} className="p-5">
              <div className="relative flex items-center gap-10">
                <img
                  src={`http://localhost:8081/productImages/${item.productImage}`}
                  alt="Product"
                  className="w-[120px] rounded-lg"
                />

                <div>
                  <h3 className="font-bold text-xl">{item.name}</h3>
                  <p className="text-gray-200">{item.brand}</p>
                  <p className="text-gray-200">
                    <strong>Flavor:</strong> {item.flavor}
                  </p>
                  <p className="text-gray-200">
                    <strong>Size:</strong> {item.size}
                  </p>
                  <p className="text-gray-200">{item.stock} Items Left</p>
                </div>

                <FontAwesomeIcon
                  icon={faTrash}
                  className="absolute top-0 right-0 text-2xl cursor-pointer"
                  onClick={() => handleRemoveItem(cartID, item.name, item.size)}
                />
              </div>

              <div className="py-4 flex justify-between text-lg">
                <p>Php {item.price.toFixed(2)}</p>

                <div className="flex gap-10 items-center">
                  <FontAwesomeIcon
                    icon={faMinus}
                    className={`text-xl cursor-pointer ${
                      item.quantity <= 1 ? "text-gray-400" : ""
                    }`}
                    onClick={() =>
                      handleQuantityChange(cartID, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  />
                  <p>{item.quantity}</p>
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-xl cursor-pointer"
                    onClick={() =>
                      handleQuantityChange(cartID, item.quantity + 1)
                    }
                  />
                </div>

                <p className="font-bold">
                  Php {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t-2 py-10 flex justify-between">
          <button
            onClick={cartClick}
            className="font-bold text-lg px-3 py-1 bg-white text-purple-200 rounded-md border-2 border-purple-200 hover:text-white hover:bg-purple-200 duration-300 ease-in-out"
          >
            View Cart
          </button>
          <button
            onClick={handleCheckout}
            className="font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out"
          >
            <strong>Checkout:</strong> Php{" "}
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
});
