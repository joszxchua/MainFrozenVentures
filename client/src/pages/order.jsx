import React, { useContext } from "react";
import { UserContext } from "../context/user-context";
import { OrderContext } from "../context/order-context";

export const Order = () => {
  const { user } = useContext(UserContext);
  const { orderProducts, clearOrder } = useContext(OrderContext);
  const productsObject = orderProducts?.products || {};
  const productsArray = Object.values(productsObject);

  return (
    <div className="mt-20 min-h-[70vh] grid grid-cols-1 md:grid-cols-[70%_30%] px-10 pb-10">
      <div className="font-inter mr-10">
        <h2 className="text-4xl font-bold mb-4">My Order</h2>
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 text-2xl">
                <th className="text-left py-2">Product</th>
                <th className="text-center py-2 w-[200px]">Flavor</th>
                <th className="text-center py-2 w-[150px]">Size</th>
                <th className="text-center py-2 w-[150px]">Price</th>
                <th className="text-center py-2 w-[150px]">Qty</th>
                <th className="text-center py-2 w-[200px]">Total</th>
              </tr>
            </thead>
            <tbody>
              {productsArray.length > 0 ? (
                productsArray.map((product, index) => (
                  <tr key={index} className="relative border-b">
                    <td className="p-4 flex items-center">
                      <img
                        src={`http://localhost:8081/productImages/${product.productImage}`}
                        alt="Product"
                        className="w-[150px] rounded-lg object-cover mr-5"
                      />
                      <div>
                        <h4 className="font-bold text-xl">{product.name}</h4>
                        <p className="text-gray-200">{product.brand}</p>
                      </div>
                    </td>
                    <td className="text-center">{product.flavor}</td>
                    <td className="text-center">{product.size}</td>
                    <td className="text-center">
                      Php {parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="text-center">x {product.quantity}</td>
                    <td className="text-center font-bold">
                      Php{" "}
                      {(parseFloat(product.price) * product.quantity).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Something went wrong
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-100 p-10 rounded-lg flex flex-col min-h-60 max-h-fit">
        <h2 className="text-4xl font-bold mb-4">Order Details</h2>

        <div className="mt-auto pt-5">
          <p className="flex justify-between font-semibold text-xl border-b pb-5 mb-5">
            <span className="font-bold">Total:</span>
            Php{" "}
            {productsArray.length > 0
              ? productsArray
                  .reduce(
                    (total, product) =>
                      total + parseFloat(product.price) * product.quantity,
                    0
                  )
                  .toFixed(2)
              : "0.00"}
          </p>

          <button className="w-full font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
