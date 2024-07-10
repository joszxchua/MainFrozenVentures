import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../context/user-context";
import { OrderContext } from "../context/order-context";
import municipalitiesInBataan from "../municipalities";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "rgb(123, 106, 194)" : provided.borderColor,
    boxShadow: state.isFocused
      ? "0 0 0 1px rgb(123, 106, 194)"
      : provided.boxShadow,
  }),
};

export const Order = () => {
  const { user } = useContext(UserContext);
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    setValue: setValueAddress,
    getValues: getValuesAddress,
  } = useForm();
  const { orderProducts, clearOrder } = useContext(OrderContext);
  const productsObject = orderProducts?.products || {};
  const productsArray = Object.values(productsObject);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [barangays, setBarangays] = useState([]);

  useEffect(() => {
    const selectedMunicipalityObj = municipalitiesInBataan.find(
      (municipality) => municipality.name === selectedMunicipality
    );

    if (selectedMunicipalityObj) {
      setBarangays(
        selectedMunicipalityObj.barangays.map((barangay) => barangay.name)
      );
    } else {
      setBarangays([]);
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    if (selectedMunicipality && selectedBarangay) {
      const selectedMunicipalityObj = municipalitiesInBataan.find(
        (municipality) => municipality.name === selectedMunicipality
      );
      if (selectedMunicipalityObj) {
        const selectedBarangayObj = selectedMunicipalityObj.barangays.find(
          (barangay) => barangay.name === selectedBarangay
        );
        if (selectedBarangayObj) {
          setValueAddress("zipCode", selectedBarangayObj.zipCode);
        }
      }
    }
  }, [selectedMunicipality, selectedBarangay, setValueAddress]);

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
        <h2 className="text-4xl font-bold mb-4">Billing</h2>

        <div className="flex flex-wrap justify-between gap-2">
          <p className="flex flex-col text-xl font-bold">
            <span className="text-lg text-gray-200 font-semibold">Name:</span>{" "}
            Vince Jeremy Canaria
          </p>

          <p className="flex flex-col text-xl font-bold">
            <span className="text-lg text-gray-200 font-semibold">Email:</span>{" "}
            customer@gmail.com
          </p>

          <p className="flex flex-col text-xl font-bold">
            <span className="text-lg text-gray-200 font-semibold">
              Phone Number:
            </span>{" "}
            09131231
          </p>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="street"
              className="text-lg text-gray-200 font-semibold"
            >
              Street:
            </label>
            <input
              type="text"
              name="street"
              id="street"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerAddress("street")}
            />
          </div>

          <div className="w-full flex gap-5">
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="municipality"
                className="text-lg text-gray-200 font-semibold"
              >
                Municipality:
              </label>
              <Select
                styles={customStyles}
                className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
                options={municipalitiesInBataan.map((municipality) => ({
                  value: municipality.name,
                  label: municipality.name,
                }))}
                value={{
                  value: selectedMunicipality,
                  label: selectedMunicipality,
                }}
                onChange={(selectedOption) =>
                  setSelectedMunicipality(selectedOption.value)
                }
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="barangay"
                className="text-lg text-gray-200 font-semibold"
              >
                Barangay:
              </label>
              <Select
                styles={customStyles}
                className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
                options={barangays.map((barangay) => ({
                  value: barangay,
                  label: barangay,
                }))}
                value={{ value: selectedBarangay, label: selectedBarangay }}
                onChange={(selectedOption) =>
                  setSelectedBarangay(selectedOption.value)
                }
              />
            </div>
          </div>

          <div className="w-full flex gap-5">
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="province"
                className="text-lg text-gray-200 font-semibold"
              >
                Province:
              </label>
              <input
                type="text"
                name="province"
                id="province"
                className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
                {...registerAddress("province")}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="zipCode"
                className="text-lg text-gray-200 font-semibold"
              >
                Zip Code:
              </label>
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
                {...registerAddress("zipCode")}
              />
            </div>
          </div>
        </form>

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