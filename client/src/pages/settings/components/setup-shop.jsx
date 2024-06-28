import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { UserContext } from "../../../context/user-context";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";

export const SetUpShop = () => {
  const { user } = useContext(UserContext);
  const fileInputRef = useRef(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [shopData, setShopData] = useState([]);
  const [isSettingUpShop, setIsSettingUpShop] = useState(false);
  const [shopLogo, setShopLogo] = useState(null);
  const [shopLogoPreview, setShopLogoPreview] = useState(null);
  const [isVerifyingShop, setIsVerifyingShop] = useState(false);
  const [document, setDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState("");
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
          setValue("shopName", accountData.shopName);
          setValue("shopDescription", accountData.shopDescription);
          setShopLogo(accountData.shopLogo);
          setShopLogoPreview(
            `http://localhost:8081/shopLogos/${accountData.shopLogo}`
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.accountId, setValue]);

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

  const handleSaveSetUpShop = async (data) => {
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
        setValue("shopName", data.shopName);
        setValue("shopDescription", data.shopDescription);
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
        "http://localhost:8081/account/uploadShopDocuments",
        formData
      );

      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setIsVerifyingShop(false);
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 2500);
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
          onSubmit={handleSubmit(handleSaveSetUpShop)}
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
                  className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
                  {...register("shopName")}
                />
              </div>
              <div className="flex flex-col gap-2 text-xl">
                <label className="font-semibold">Shop Description:</label>
                <textarea
                  rows="5"
                  name="shopDescription"
                  id="shopDescription"
                  disabled={!isSettingUpShop}
                  className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
                  {...register("shopDescription")}
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

      {shopData.isVerified === 0 && (
        <div className="mt-3">
          <div className="flex items-center">
            <p className="w-28 font-semibold text-gray-200">Verify Shop</p>
            <div className="w-full border-t-2"></div>
          </div>

          <div className="mt-5 flex flex-col items-center">
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
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
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
    </>
  );
};
