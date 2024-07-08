import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Blueberry from "../assets/flavors/Blueberry.jpg"; // Assuming this is a placeholder image

export const Cart = () => {
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
    <div className="mt-20 min-h-[70vh] grid grid-cols-1 md:grid-cols-[70%_30%] px-10 pb-10">
      <div className="font-inter mr-10">
        <h2 className="text-4xl font-bold mb-4">My Cart</h2>

        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
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
                <tr key={cartID} className="relative">
                  <td className="my-4 flex items-center">
                    <img
                      src={`http://localhost:8081/productImages/${item.productImage}` || Blueberry}
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
                        className="text-xl cursor-pointer"
                      />
                      <p>{item.quantity}</p>
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="text-xl cursor-pointer"
                      />
                    </div>
                  </td>
                  <td className="text-center">Php {(item.price * item.quantity).toFixed(2)}</td>
                  <td className="absolute top-5 right-5 text-xl cursor-pointer">
                    <FontAwesomeIcon icon={faTrash} />
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
            <p className="text-gray-200">{item.brand}, {item.flavor}, {item.size}, x{item.quantity}</p>
          </div>
        ))}

        <div className="mt-auto pt-5">
          <p className="flex justify-between font-semibold text-xl border-b pb-5 mb-5">
            <span className="font-bold">Total:</span> 
            Php {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
          </p>

          <button className="w-full font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};