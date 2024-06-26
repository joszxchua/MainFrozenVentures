import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { CodeGenerator } from "../../../components/codegenerator";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";

export const Security = () => {
  const { user } = useContext(UserContext);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [code, setCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [email, setEmail] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [inputCurrentPassword, setInputCurrentPassword] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
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
            setEmail(userData.email);
            setPhone(userData.phone);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId]);

  const handleChangeEmail = () => {
    setIsChangingPassword(false);
    setIsChangingPhone(false);
    setIsChangingEmail(true);
  };

  const handleCancelChangeEmail = () => {
    setIsChangingEmail(false);
    setShowCode(false);
    setInputEmail("");
    setInputCode("");
    setCode("");
  };

  const handleSaveChangeEmail = () => {
    const emailPattern = /@.*\.com$/;

    if (inputEmail && emailPattern.test(inputEmail)) {
      setShowCode(true);
    } else {
      setMessageTitle("Error");
      setMessage("Invalid or missing email");
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  const handleConfirmChangeEmail = async () => {
    if (inputCode === code) {
      setIsLoading(true);
      try {
        const formData = {
          accountId: user.accountId,
          email: inputEmail,
        };

        const response = await axios.post(
          "http://localhost:8081/account/changeEmail",
          formData
        );

        if (response.data.status === "success") {
          setMessageTitle("Success");
          setMessage(response.data.message);
        } else {
          setMessageTitle("Error");
          setMessage(response.data.message);
        }
      } catch (error) {
        setMessageTitle("Error");
        setMessage("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessageTitle("Error");
      setMessage("Invalid code, please try again");
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
      setInputEmail("");
      setInputCode("");
      setCode("");
      setShowCode(false);
      setIsChangingEmail(false);
    }, 3000);
  };

  const handleChangePhone = () => {
    setIsChangingPassword(false);
    setIsChangingEmail(false);
    setIsChangingPhone(true);
  };

  const handleCancelChangePhone = () => {
    setIsChangingPhone(false);
  };

  const handleSaveChangePhone = async () => {
    setIsLoading(true);
    try {
      const formData = {
        accountId: user.accountId,
        phone: inputPhone,
      };

      const response = await axios.post(
        "http://localhost:8081/account/changePhone",
        formData
      );

      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setPhone(inputPhone);
      } else {
        setMessageTitle("Error");
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
      setInputPhone("");
      setIsChangingPhone(false);
    }, 3000);
  };

  const handleChangePassword = () => {
    setIsChangingEmail(false);
    setIsChangingPhone(false);
    setIsChangingPassword(true);
  };

  const handleCancelChangePassword = () => {
    setInputCurrentPassword("");
    setInputNewPassword("");
    setInputConfirmPassword("");
    setIsChangingPassword(false);
  };

  const handleSaveChangePassword = async () => {
    setIsLoading(true);
    try {
      const formData = {
        accountId: user.accountId,
        currentPassword: inputCurrentPassword,
        newPassword: inputNewPassword,
        confirmPassword: inputConfirmPassword,
      };

      const response = await axios.post(
        "http://localhost:8081/account/changePassword",
        formData
      );

      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setPhone(inputPhone);
        setInputCurrentPassword("");
        setInputNewPassword("");
        setInputConfirmPassword("");
      } else {
        setMessageTitle("Error");
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessageTitle("Error");
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
      setInputPhone("");
      setIsChangingPhone(false);
    }, 3000);
  };

  return (
    <>
      {messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      <h2 className="text-4xl font-bold">Security</h2>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">Change Email</p>
          <div className="w-full border-t-2"></div>
        </div>

        <div className="flex flex-col items-center gap-5 py-5">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-medium">Current Email:</h3>
            <p className="text-2xl text-black font-semibold">{email}</p>
          </div>

          {isChangingEmail && (
            <>
              <div className="w-[60%] flex flex-col gap-2">
                <label htmlFor="newEmail" className="text-lg font-medium">
                  New Email:
                </label>
                <input
                  type="text"
                  name="newEmail"
                  id="newEmail"
                  className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
              </div>

              {showCode && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 backdrop-blur-sm">
                  <div className="min-w-[600px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-40 bg-white p-10 border-4 border-purple-200 rounded-lg">
                    <h3 className="font-bold text-3xl">Verification Code</h3>
                    {code && (
                      <div className="my-5 text-center text-xl">
                        <h3>Verification code has been sent to this email:</h3>
                        <p className="font-bold">{inputEmail}</p>
                      </div>
                    )}
                    <div className="mt-5 input-group code-container">
                      <div className="flex flex-col w-full">
                        <label className="font-semibold text-xl" htmlFor="code">
                          Code:
                        </label>
                        <input
                          className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
                          type="number"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                        />
                      </div>
                      <CodeGenerator
                        inputEmail={inputEmail}
                        code={code}
                        setCode={setCode}
                      />
                      <div className="mt-10 w-full flex justify-between">
                        <button
                          type="button"
                          onClick={handleCancelChangeEmail}
                          className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmChangeEmail}
                          className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                          disabled={isLoading}
                        >
                          {isLoading ? "Confirming..." : "Confirm"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {isChangingEmail ? (
          <div className="mt-5 w-full flex justify-around">
            <button
              type="button"
              onClick={handleCancelChangeEmail}
              className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveChangeEmail}
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
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
            <h3 className="text-xl font-medium">Current Phone:</h3>
            <p className="text-2xl text-black font-semibold">{phone}</p>
          </div>

          {isChangingPhone && (
            <div className="w-[60%] flex flex-col gap-2">
              <label htmlFor="newPhone" className="text-lg font-medium">
                New Phone:
              </label>
              <input
                type="number"
                name="newPhone"
                id="newPhone"
                className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
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
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveChangePhone}
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
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
              disabled={!isChangingPassword}
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              value={inputCurrentPassword}
              onChange={(e) => setInputCurrentPassword(e.target.value)}
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
              disabled={!isChangingPassword}
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              value={inputNewPassword}
              onChange={(e) => setInputNewPassword(e.target.value)}
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
              disabled={!isChangingPassword}
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              value={inputConfirmPassword}
              onChange={(e) => setInputConfirmPassword(e.target.value)}
            />
          </div>
        </form>

        {isChangingPassword ? (
          <div className="mt-5 w-full flex justify-around">
            <button
              type="button"
              onClick={handleCancelChangePassword}
              className="bg-gray-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-gray-200 hover:bg-white duration-300 hover:text-gray-200 ease-in-out"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveChangePassword}
              className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
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
