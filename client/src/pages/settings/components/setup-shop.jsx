import React, { useContext, useState, useRef } from "react";
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
  const { register, handleSubmit, reset } = useForm();
  const [isSettingUpShop, setIsSettingUpShop] = useState(false);
  const [shopLogo, setShopLogo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSetUpShop = () => {
    setIsSettingUpShop(true);
  };

  const handleCancelSetUpShop = () => {
    setIsSettingUpShop(false);
    setShopLogo(null);
    reset();
  };

  const handleSelectPicture = () => {
    document.getElementById("fileInput").click();
  };

  const handleSaveSetUpShop = (data) => {
    if (!shopLogo) {
      console.log("No picture selected");
      return;
    }

    console.log(data)
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
            <div className="flex flex-col gap-5 items-center justify-center">
              {shopLogo ? (
                <img
                  onClick={isSettingUpShop ? handleSelectPicture : null}
                  src={`http://localhost:8081/profileImages/${shopLogo}`}
                  alt="Shop Logo"
                  className="rounded-lg w-60 object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  onClick={isSettingUpShop ? handleSelectPicture : null}
                  icon={faShop}
                  className="text-[250px]"
                />
              )}

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setShopLogo(e.target.files[0])}
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
