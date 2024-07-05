import React, { useContext, useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

export const SideCart = forwardRef(({ closeSideCart, cartClick }, ref) => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

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
        <div className="max-h-[80vh] overflow-y-auto">
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
                </div>

                <FontAwesomeIcon
                  icon={faTrash}
                  className="absolute top-0 right-0 text-2xl cursor-pointer"
                />
              </div>

              <div className="py-4 flex justify-between text-lg">
                <p>Php {item.price.toFixed(2)}</p>

                <div className="flex gap-10 items-center">
                  <FontAwesomeIcon
                    icon={faMinus}
                    className="text-xl cursor-pointer"
                  />

                  <p>{item.quantity}</p>

                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-xl cursor-pointer"
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
          <button className="font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out">
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
