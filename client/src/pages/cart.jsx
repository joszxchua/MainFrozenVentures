import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { SuccessMessage } from "../components/success-message";
import { ErrorMessage } from "../components/error-message";

export const Cart = () => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

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
          setError("Error fetching data");
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user]);

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
        console.error("Error updating quantity:", error);
      });
  };

  const handleRemoveItem = (cartID) => {
    const removedItem = cartItems[cartID];

    setCartItems((prevItems) =>
      prevItems.filter((_, index) => index !== cartID)
    );

    axios
      .post("http://localhost:8081/cart/removeItem", {
        accountId: user.accountId,
        productId: removedItem.productID,
        sizeId: removedItem.sizeID,
      })
      .then((response) => {
        if (response.data.status !== 1) {
          console.error("Failed to remove item");
        }
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
  };

  return (
    <div className="mt-20 min-h-[70vh] grid grid-cols-1 md:grid-cols-[70%_30%] px-10 pb-10">
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      <div className="font-inter mr-10">
        <h2 className="text-4xl font-bold mb-4">My Cart</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-2">Product</th>
                <th className="text-center py-2 w-[200px]">Flavor</th>
                <th className="text-center py-2 w-[150px]">Size</th>
                <th className="text-center py-2 w-[150px]">Price</th>
                <th className="text-center py-2 w-[150px]">Qty</th>
                <th className="text-center py-2 w-[200px]">Total</th>
                <th className="py-2 w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, cartID) => (
                <tr key={cartID} className="relative border-b">
                  <td className="p-4 flex items-center">
                    <img
                      src={`http://localhost:8081/productImages/${item.productImage}`}
                      alt="Product"
                      className="w-[150px] rounded-lg object-cover mr-5"
                    />
                    <div>
                      <h4 className="font-bold text-xl">{item.name}</h4>
                      <p className="text-gray-200">{item.brand}</p>
                    </div>
                  </td>
                  <td className="text-center">{item.flavor}</td>
                  <td className="text-center">{item.size}</td>
                  <td className="text-center">Php {item.price.toFixed(2)}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-10 items-center">
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
                  </td>
                  <td className="text-center font-bold">
                    Php {(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="absolute top-5 right-5 text-xl cursor-pointer">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleRemoveItem(cartID)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-100 p-10 rounded-lg flex flex-col h-fit">
        <h2 className="text-4xl font-bold mb-4">Cart Summary</h2>

        {cartItems.map((item, cartID) => (
          <div key={cartID} className="py-2">
            <div className="flex justify-between items-center font-semibold text-xl">
              <h4>{item.name}</h4>
              <p>Php {(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <p className="text-gray-200">
              {item.brand}, {item.flavor}, {item.size}, x{item.quantity}
            </p>
          </div>
        ))}

        <div className="mt-auto pt-5">
          <p className="flex justify-between font-semibold text-xl border-b pb-5 mb-5">
            <span className="font-bold">Total:</span>
            Php{" "}
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </p>

          <button className="w-full font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
