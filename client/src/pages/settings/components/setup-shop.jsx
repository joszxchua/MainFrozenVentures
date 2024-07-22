import React, { useContext, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import municipalitiesInBataan from "../../../municipalities";
import Select from "react-select";
import { UserContext } from "../../../context/user-context";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "rgb(123, 106, 194)" : provided.borderColor,
    boxShadow: state.isFocused
      ? "0 0 0 1px rgb(123, 106, 194)"
      : provided.boxShadow,
  }),
};

export const SetUpShop = () => {
  const { user } = useContext(UserContext);
  const {
    register: registerShop,
    handleSubmit: handleSubmitShop,
    setValue: setValueShop,
    getValues: getValuesShop,
  } = useForm();
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    setValue: setValueAddress,
    getValues: getValuesAddress,
  } = useForm();
  const fileInputRef = useRef(null);
  const [shopData, setShopData] = useState([]);
  const [isSettingUpShop, setIsSettingUpShop] = useState(false);
  const [shopLogo, setShopLogo] = useState(null);
  const [shopLogoPreview, setShopLogoPreview] = useState(null);
  const [isVerifyingShop, setIsVerifyingShop] = useState(false);
  const [document, setDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [barangays, setBarangays] = useState([]);
  const [initialShopValues, setInitialShopValues] = useState({});
  const [initialAddressValues, setInitialAddressValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8081/account/shopFetch",
          {
            accountId: user.accountId,
          }
        );
        if (response.data.status === "success") {
          const accountData = response.data.account;

          setShopData(accountData);
          setInitialShopValues({
            shopName: accountData.shopName,
            shopDescription: accountData.shopDescription,
          });

          setValueShop("shopName", accountData.shopName);
          setValueShop("shopDescription", accountData.shopDescription);

          setShopLogo(accountData.shopLogo);
          setShopLogoPreview(
            `http://localhost:8081/shopLogos/${accountData.shopLogo}`
          );

          setInitialAddressValues({
            street: accountData.street,
            municipality: accountData.municipality,
            barangay: accountData.barangay,
            province: accountData.province,
            zipCode: accountData.zipCode,
          });

          setValueAddress("street", accountData.street);
          setValueAddress("municipality", accountData.municipality);
          setValueAddress("barangay", accountData.barangay);
          setValueAddress("province", accountData.province);
          setValueAddress("zipCode", accountData.zipCode);
          setSelectedMunicipality(accountData.municipality);
          setSelectedBarangay(accountData.barangay);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.accountId, setValueShop, setValueAddress]);

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

  const handleSetUpShop = () => {
    setIsSettingUpShop(true);
  };

  const handleCancelSetUpShop = () => {
    setIsSettingUpShop(false);
    setShopLogo(null);
    setShopLogoPreview(null);
    reset();
  };

  const handleSelectPicture = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopLogo(file);
      setShopLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitShop = async (data) => {
    setIsLoading(true);

    if (!data.shopName || !data.shopDescription) {
      setMessageTitle("Error");
      setMessage("Shop name and description cannot be empty.");
      setIsLoading(false);

      setTimeout(() => {
        setMessageTitle("");
        setMessage("");
        setValue("shopName", data.shopName);
        setValue("shopDescription", data.shopDescription);
      }, 3000);

      return;
    }

    try {
      const formData = new FormData();
      formData.append("accountId", user.accountId);
      formData.append("shopLogo", shopLogo);
      formData.append("shopName", data.shopName);
      formData.append("shopDescription", data.shopDescription);

      const response = await axios.post(
        "http://localhost:8081/account/setUpShop",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
      } else if (response.data.status === "error") {
        setMessageTitle("Error");
        setMessage(response.data.message);
        setValueShop("shopName", data.shopName);
        setValueShop("shopDescription", data.shopDescription);
      }
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
      setIsSettingUpShop(false);
      setIsLoading(false);
    }, 3000);
  };

  const handleVerifyShop = () => {
    setIsVerifyingShop(true);
  };

  const handleCancelVerifyShop = () => {
    setIsVerifyingShop(false);
  };

  const handleDocumentChange = (e) => {
    const selectedDocument = e.target.files[0];
    if (selectedDocument) {
      if (selectedDocument.type !== "application/pdf") {
        setMessageTitle("Error");
        setMessage("Only PDF files are allowed");

        setTimeout(() => {
          setMessageTitle("");
          setMessage("");
          setDocument(null);
          e.target.value = "";
        }, 3000);
        return;
      }
      const reader = new FileReader();

      reader.onload = (event) => {
        setDocument(selectedDocument);
        setDocumentContent(event.target.result);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsText(selectedDocument);
    }
  };

  const handleSubmitVerify = async () => {
    setIsLoading(true);
    if (!document) {
      setMessageTitle("Error");
      setMessage("Please select your document");

      setTimeout(() => {
        setMessageTitle("");
        setMessage("");
        setDocument("");
        setIsLoading(false);
      }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("shopDocument", document);
    formData.append("accountId", user.accountId);

    try {
      const response = await axios.post(
        "http://localhost:8081/shop/uploadShopDocuments",
        formData
      );

      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
      } else if (response.data.status === "error") {
        setMessageTitle("Error");
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("Something went wrong");
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
      setDocument(null);
      setIsLoading(false);
      setIsVerifyingShop(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 2500);
  };

  const handleEditAddressInfo = () => {
    setIsEditingAddress(true);
    setIsEditingPersonal(false);
  };

  const handleCancelEditAddress = () => {
    setValueAddress("street", initialAddressValues.street);
    setValueAddress("municipality", initialAddressValues.municipality);
    setValueAddress("barangay", initialAddressValues.barangay);
    setValueAddress("province", initialAddressValues.province);
    setValueAddress("zipCode", initialAddressValues.zipCode);
    setSelectedMunicipality(initialAddressValues.municipality);
    setSelectedBarangay(initialAddressValues.barangay);
    setIsEditingAddress(false);
  };

  const onSubmitAddress = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/account/addressUpdate",
        {
          ...data,
          municipality: selectedMunicipality,
          barangay: selectedBarangay,
          accountId: user.accountId,
        }
      );
      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setInitialAddressValues(data);
      } else {
        setMessageTitle("Error");
        setMessage(response.data.message);
        setValueAddress("street", initialAddressValues.street);
        setValueAddress("municipality", initialAddressValues.municipality);
        setValueAddress("barangay", initialAddressValues.barangay);
        setValueAddress("province", initialAddressValues.province);
        setValueAddress("zipCode", initialAddressValues.zipCode);
        setSelectedMunicipality(initialAddressValues.municipality);
        setSelectedBarangay(initialAddressValues.barangay);
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("Something went wrong");
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
    setIsEditingAddress(false);
  };

  return (
    <>
      {messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      <div className="flex text-4xl font-bold">
        <FontAwesomeIcon icon={faShop} className="mr-3" />
        <h2>Set Up Shop</h2>
      </div>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-28 font-semibold text-gray-200">Set Up Shop</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form
          onSubmit={handleSubmitShop(onSubmitShop)}
          className="flex flex-col items-center gap-5 py-5"
        >
          <div className="w-full flex gap-10">
            <div className="w-full flex flex-col gap-5 items-center justify-center">
              {shopLogoPreview ? (
                <img
                  onClick={isSettingUpShop ? handleSelectPicture : null}
                  src={shopLogoPreview}
                  alt="Shop Logo"
                  className="rounded-lg w-60 h-60 object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  onClick={isSettingUpShop ? handleSelectPicture : null}
                  icon={faShop}
                  className="text-[200px]"
                />
              )}

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {isSettingUpShop && (
                <button
                  type="button"
                  onClick={handleSelectPicture}
                  className="font-bold px-4 py-2 bg-purple-200 border-2 border-purple-200 text-white cursor-pointer rounded-lg hover:bg-white hover:text-purple-200 duration-300"
                >
                  Select Image
                </button>
              )}
            </div>

            <div className="w-full flex flex-col gap-5">
              <div className="flex flex-col gap-2 text-xl">
                <label className="font-semibold">Shop Name:</label>
                <input
                  type="text"
                  name="shopName"
                  id="shopName"
                  disabled={!isSettingUpShop}
                  className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
                  {...registerShop("shopName")}
                />
              </div>
              <div className="flex flex-col gap-2 text-xl">
                <label className="font-semibold">Shop Description:</label>
                <textarea
                  rows="5"
                  name="shopDescription"
                  id="shopDescription"
                  disabled={!isSettingUpShop}
                  className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
                  {...registerShop("shopDescription")}
                />
              </div>
            </div>
          </div>

          {isSettingUpShop ? (
            <div className="mt-10 w-full flex justify-around">
              <button
                type="button"
                onClick={handleCancelSetUpShop}
                className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleSetUpShop}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Set Up Shop
              </button>
            </div>
          )}
        </form>
      </div>

      {shopData.isVerified !== 1 && (
        <div className="mt-3">
          <div className="flex items-center">
            <p className="w-28 font-semibold text-gray-200">Verify Shop</p>
            <div className="w-full border-t-2"></div>
          </div>

          <div className="mt-5 flex flex-col items-center">
            {shopData.isVerified === 2 && (
              <p className="px-3 py-1 font-bold text-lg text-red-200 bg-red-100 rounded-lg">
                Your document was rejected, Please resubmit your document with
                complete requirements
              </p>
            )}
            <h4 className="font-bold text-xl">
              Please insert the following into a single PDF file:
            </h4>
            <ul className="mt-3 text-lg flex flex-col gap-2 text-left">
              <li>1. Business Name Registration</li>
              <li>2. Barangay Clearance</li>
              <li>3. Mayor's Permit</li>
              <li>4. Bureau of Internal Revenue</li>
              <li>5. Food and Drug Administration</li>
            </ul>
          </div>

          <div className="mt-5 flex flex-col gap-2 items-center text-xl">
            <label className="font-semibold" htmlFor="shopImage">
              Document:
            </label>
            <input
              type="file"
              id="shopImage"
              name="shopImage"
              accept=".pdf"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              disabled={!isVerifyingShop}
              onChange={handleDocumentChange}
              ref={fileInputRef}
            />
          </div>

          {isVerifyingShop ? (
            <div className="mt-10 w-full flex justify-around">
              <button
                type="button"
                onClick={handleCancelVerifyShop}
                className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitVerify}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          ) : (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleVerifyShop}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Verify Shop
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-20">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">
            Address Information
          </p>
          <div className="w-full border-t-2"></div>
        </div>

        <form
          onSubmit={handleSubmitAddress(onSubmitAddress)}
          className="flex flex-col items-center gap-5 py-5"
        >
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="street" className="text-lg font-medium">
              Street:
            </label>
            <input
              type="text"
              name="street"
              id="street"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerAddress("street")}
              disabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="municipality" className="text-lg font-medium">
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
              isDisabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="barangay" className="text-lg font-medium">
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
              isDisabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="province" className="text-lg font-medium">
              Province:
            </label>
            <input
              type="text"
              name="province"
              id="province"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerAddress("province")}
              disabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="zipCode" className="text-lg font-medium">
              Zip Code:
            </label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              className="text-lg px-3 py-1 border-[1px] border-gray-200 rounded-[5px] w-full outline-purple-200"
              {...registerAddress("zipCode")}
              disabled={!isEditingAddress}
            />
          </div>

          {isEditingAddress ? (
            <div className="w-full flex justify-around">
              <button
                type="button"
                onClick={handleCancelEditAddress}
                className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleEditAddressInfo}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Edit Address Information
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};
