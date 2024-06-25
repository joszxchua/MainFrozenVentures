import React, { useState } from "react";

export const Security = () => {
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangeEmail = () => {
    setIsChangingPassword(false);
    setIsChangingPhone(false);
    setIsChangingEmail(true);
  };

  const handleCancelChangeEmail = () => {
    setIsChangingEmail(false);
  };

  const handleChangePhone = () => {
    setIsChangingPassword(false);
    setIsChangingEmail(false);
    setIsChangingPhone(true);
  };

  const handleCancelChangePhone = () => {
    setIsChangingPhone(false);
  };

  const handleChangePassword = () => {
    setIsChangingEmail(false);
    setIsChangingPhone(false);
    setIsChangingPassword(true);
  };

  const handleCancelChangePassword = () => {
    setIsChangingPassword(false);
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Security</h2>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">Change Email</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-medium">Current Email:</h3>
            <p className="text-3xl text-black font-semibold">
              current@email.com
            </p>
          </div>

          {isChangingEmail && (
            <div className="w-[60%] flex flex-col gap-2">
              <label htmlFor="newEmail" className="text-lg font-medium">
                New Email:
              </label>
              <input
                type="text"
                name="newEmail"
                id="newEmail"
                className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              />
            </div>
          )}
        </form>

        {isChangingEmail ? (
          <div className="mt-5 w-full flex justify-around">
            <button
              type="button"
              onClick={handleCancelChangeEmail}
              className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleChangeEmail}
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Change Email
            </button>
          </div>
        )}
      </div>

      <div className="mt-20">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">Change Phone</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-medium">Current Phone:</h3>
            <p className="text-3xl text-black font-semibold">09209093213</p>
          </div>

          {isChangingPhone && (
            <div className="w-[60%] flex flex-col gap-2">
              <label htmlFor="newPhone" className="text-lg font-medium">
                New Phone:
              </label>
              <input
                type="number"
                name="oldPhone"
                id="oldPhone"
                className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              />
            </div>
          )}
        </form>

        {isChangingPhone ? (
          <div className="mt-5 w-full flex justify-around">
            <button
              type="button"
              onClick={handleCancelChangePhone}
              className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleChangePhone}
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Change Phone
            </button>
          </div>
        )}
      </div>

      <div className="mt-20">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">Change Password</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="currentPassword" className="text-lg font-medium">
              Current Password:
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="newPassword" className="text-lg font-medium">
              New Password:
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-lg font-medium">
              Confirm Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
            />
          </div>
        </form>

        {isChangingPassword ? (
          <div className="mt-5 w-full flex justify-around">
            <button
              type="button"
              onClick={handleCancelChangePassword}
              className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleChangePassword}
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </>
  );
};
