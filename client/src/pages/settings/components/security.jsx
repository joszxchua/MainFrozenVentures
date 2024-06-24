import React from "react";

export const Security = () => {
  return (
    <>
      <h2 className="text-4xl font-bold">Security</h2>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">Change Email</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="oldEmail" className="text-lg font-medium">
              Old Email:
            </label>
            <input
              type="text"
              name="oldEmail"
              id="oldEmail"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
            />
          </div>

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
        </form>

        <div className="flex justify-center">
          <button className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
            Change Email
          </button>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">Change Phone</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="oldPhone" className="text-lg font-medium">
              Old Phone:
            </label>
            <input
              type="number"
              name="oldPhone"
              id="oldPhone"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
            />
          </div>

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
        </form>

        <div className="flex justify-center">
          <button className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
            Change Phone
          </button>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">Change Password</p>
          <div className="w-full border-t-2"></div>
        </div>

        <form className="flex flex-col items-center gap-5 py-5">
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="oldPassword" className="text-lg font-medium">
              Old Password:
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
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

        <div className="flex justify-center">
          <button className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
            Change Password
          </button>
        </div>
      </div>
    </>
  );
};
