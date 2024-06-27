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
  const [isSettingUpShop, setIsSettingUpShop] = useState(false);
  const [shopLogo, setShopLogo] = useState();
  const [shopLogoPreview, setShopLogoPreview] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user.accountId) {
        try {
          const response = await axios.post(
            "http://localhost:8081/account/shopFetch",
            {
              accountId: user.accountId,
            }
          );
          if (response.data.status === 1) {
            const shopData = response.data.account;
            console.log(shopData);
            setValue("shopName", shopData.shopName);
            setValue("shopDescription", shopData.shopDescription);
            setShopLogo(shopData.shopLogo);
            setShopLogoPreview(
              `http://localhost:8081/shopLogos/${shopData.shopLogo}`
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
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

  const handleSaveSetUpShop = async (data) => {
    setIsLoading(true);

    if (!shopLogo) {
      console.log("No picture selected");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("accountId", user.accountId);
      formData.append("shopLogo", shopLogo);
      formData.append("shopName", data.shopName);
      formData.append("shopDescription", data.shopDescription);

      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(
        "http://localhost:8081/account/setUpShop",
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
      console.log(error);
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
      setIsSettingUpShop(false);
      setIsLoading(false);
    }, 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopLogo(file);
      setShopLogoPreview(URL.createObjectURL(file));
    }
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
                  name="shopDescription"
                  id="shopDescription"
                  disabled={!isSettingUpShop}
                  className="h-[135px] text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
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

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-28 font-semibold text-gray-200">Verify Shop</p>
          <div className="w-full border-t-2"></div>
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
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </div>
        ) : (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleSetUpShop}
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Verify Shop
            </button>
          </div>
        )}
      </div>
    </>
  );
};
