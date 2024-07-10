import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
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
  const { orderProducts } = useContext(OrderContext);
  const productsObject = orderProducts?.products || {};
  const productsArray = Object.values(productsObject);
  const [personalInfo, setPersonalInfo] = useState({});
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [barangays, setBarangays] = useState([]);
  const [shippingMode, setShippingMode] = useState("Pickup");

  useEffect(() => {
    const fetchPersonalData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/account/accountFetch",
            {
              accountId: user.accountId,
            }
          );
          if (response.data.status === 1) {
            const userData = response.data.account;

            setValueAddress("street", userData.street);
            setValueAddress("municipality", userData.municipality);
            setValueAddress("barangay", userData.barangay);
            setValueAddress("province", userData.province);
            setValueAddress("zipCode", userData.zipCode);
            setSelectedMunicipality(userData.municipality);
            setSelectedBarangay(userData.barangay);

            setPersonalInfo(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchPersonalData();
  }, [user.accountId]);

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

  const VAT_RATE = 0.12;
  const SERVICE_FEE_RATE = 0.05;
  let totalProductAmount = 0;
  let serviceFee = 0;

  if (productsArray) {
    productsArray.forEach((product) => {
      const subtotal = product.price * product.quantity;
      const productServiceFee = subtotal * SERVICE_FEE_RATE;

      totalProductAmount += subtotal;
      serviceFee += productServiceFee;
    });
  }

  const shippingCost =
    shippingMode === "Pickup" ? 0 : 10 * Object.keys(productsObject).length;
  const vat = (totalProductAmount + shippingCost + serviceFee) * VAT_RATE;
  const totalOrderCost = totalProductAmount + shippingCost + serviceFee + vat;

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxReceiveDate = maxDate.toISOString().split("T")[0];

  const onSubmitOrder = async (data) => {
    let orderTotal = 0;

    for (const product of productsArray) {
      const serviceFee = product.price * product.quantity * SERVICE_FEE_RATE;
      const shippingFee =
        shippingMode === "Delivery" ? 10 : 0;
      const vat =
        (Number(product.price) * product.quantity + serviceFee + shippingFee) *
        VAT_RATE;
      const totalPrice =
        Number(product.price) * product.quantity +
        serviceFee +
        shippingFee +
        vat;

      orderTotal += totalPrice;

      const orderData = {
        accountId: user.accountId,
        productId: product.productId,
        sizeId: product.sizeId,
        orderDate: new Date().toISOString().split("T")[0],
        shippingMode: shippingMode,
        receiveDate: data.receiveDate,
        status: product.status,
        quantity: product.quantity,
        totalPrice: totalPrice.toFixed(2),
      };

      console.log(orderData);
    }

    console.log("Total Order Cost:", orderTotal.toFixed(2));
  };

  const handleSubmitForm = () => {
    handleSubmitAddress(onSubmitOrder)();
  };

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
            {personalInfo.firstName} {personalInfo.lastName}
          </p>

          <p className="flex flex-col text-xl font-bold">
            <span className="text-lg text-gray-200 font-semibold">Email:</span>{" "}
            {personalInfo.email}
          </p>

          <p className="flex flex-col text-xl font-bold">
            <span className="text-lg text-gray-200 font-semibold">
              Phone Number:
            </span>{" "}
            {personalInfo.phone}
          </p>
        </div>

        <form
          onSubmit={handleSubmitAddress(onSubmitOrder)}
          className="mt-10 flex flex-col items-center gap-3"
        >
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
                onChange={(selectedOption) => {
                  setSelectedMunicipality(selectedOption.value);
                  setSelectedBarangay("");
                }}
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
                readOnly
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
                readOnly
              />
            </div>
          </div>
        </form>

        <div className="mt-10 w-full flex gap-5">
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="shippingMode"
              className="text-lg text-gray-200 font-semibold"
            >
              Shipping Mode:
            </label>
            <Select
              styles={customStyles}
              className="text-lg border-gray-200 rounded-[5px] w-full outline-purple-200"
              options={[
                { value: "Pickup", label: "Pickup" },
                { value: "Delivery", label: "Delivery" },
              ]}
              value={{ value: shippingMode, label: shippingMode }}
              onChange={(selectedOption) =>
                setShippingMode(selectedOption.value)
              }
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="receiveDate"
              className="text-lg text-gray-200 font-semibold"
            >
              Receive Date:
            </label>
            <input
              type="date"
              name="receiveDate"
              id="receiveDate"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerAddress("receiveDate")}
              min={today}
              max={maxReceiveDate}
            />
          </div>
        </div>

        <div className="mt-10">
          <p className="flex justify-between font-semibold text-xl mb-5">
            <span className="font-bold">Sub Total:</span>
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
          <p className="flex justify-between font-semibold text-xl mb-5">
            <span className="font-bold">Service Fee:</span>
            Php {serviceFee.toFixed(2)}
          </p>
          <p className="flex justify-between font-semibold text-xl mb-5">
            <span className="font-bold">Delivery Fee:</span>
            Php {shippingCost.toFixed(2)}
          </p>
          <p className="flex justify-between font-semibold text-xl border-b pb-5 mb-5">
            <span className="font-bold">Vat:</span>
            Php {vat.toFixed(2)}
          </p>

          <button
            onClick={handleSubmitForm}
            className="w-full font-bold text-lg px-3 py-1 bg-purple-200 text-white rounded-md border-2 border-purple-200 hover:text-purple-200 hover:bg-white duration-300 ease-in-out"
          >
            Checkout : Php {totalOrderCost.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};
