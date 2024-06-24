import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import municipalitiesInBataan from "../../../municipalities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "../../../components/errormessage";
import { SuccessMessage } from "../../../components/successmessage";

export const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [barangays, setBarangays] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      birthdate: "",
      street: "",
      municipality: "",
      barangay: "",
      province: "Bataan",
      zipCode: "",
      userRole: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNextStep = () => {
    handleSubmit((data) => {
      if (Object.keys(errors).length === 0) {
        setCurrentStep((prevStep) => prevStep + 1);
      }
    })();
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxYear = today.getFullYear() - 13;
    const maxMonth = today.getMonth() + 1;
    const maxDay = today.getDate();
    return `${maxYear}-${String(maxMonth).padStart(2, "0")}-${String(
      maxDay
    ).padStart(2, "0")}`;
  };

  const municipalities = municipalitiesInBataan.map((municipality) => ({
    name: municipality.name,
  }));

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
          setValue("zipCode", selectedBarangayObj.zipCode);
        }
      }
    }
  }, [selectedMunicipality, selectedBarangay]);

  const handleChangeMunicipality = (e) => {
    const selectedMunicipalityName = e.target.value;
    setSelectedMunicipality(selectedMunicipalityName);
    setSelectedBarangay("");
    setValue("barangay", "");
    setValue("zipCode", "");

    const selectedMunicipalityObj = municipalitiesInBataan.find(
      (municipality) => municipality.name === selectedMunicipalityName
    );

    if (selectedMunicipalityObj) {
      setBarangays(
        selectedMunicipalityObj.barangays.map((barangay) => barangay.name)
      );
    }
  };

  const handleChangeBarangay = (e) => {
    const selectedBarangayName = e.target.value;
    setSelectedBarangay(selectedBarangayName);

    const selectedMunicipalityObj = municipalitiesInBataan.find(
      (municipality) => municipality.name === selectedMunicipality
    );

    if (selectedMunicipalityObj) {
      const selectedBarangayObj = selectedMunicipalityObj.barangays.find(
        (barangay) => barangay.name === selectedBarangayName
      );
      if (selectedBarangayObj) {
        setValue("zipCode", selectedBarangayObj.zipCode);
      }
    }
  };

  const handleSignUp = (data) => {
    setIsSigningUp(true);
    axios
      .post("http://localhost:8081/account/createAccount", data)
      .then((response) => {
        if (response.data.status === 1) {
          setMessageTitle("Success");
          setMessage(response.data.message);
          reset();
        } else {
          setMessageTitle("Error");
          setMessage(response.data.message);
        }

        setTimeout(() => {
          setMessageTitle("");
          setMessage("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Sign-up error:", error);
      })
      .finally(() => {
        setIsSigningUp(false);
      });
  };

  return (
    <>
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      <div className="w-full flex flex-col">
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="flex flex-col justify-center gap-10"
        >
          {currentStep === 1 && (
            <>
              <div className="flex justify-between gap-5">
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="firstName">
                    First Name:
                  </label>
                  <input
                    {...register("firstName", { required: true })}
                    className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    type="text"
                  />
                  {errors.firstName && (
                    <span className="text-red-500">First name is required</span>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="lastName">
                    Last Name:
                  </label>
                  <input
                    {...register("lastName", { required: true })}
                    className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    type="text"
                  />
                  {errors.lastName && (
                    <span className="text-red-500">Last name is required</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="gender">
                  Gender:
                </label>
                <select
                  {...register("gender", { required: true })}
                  className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <span className="text-red-500">Gender is required</span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="birthdate">
                  Birthday:
                </label>
                <input
                  {...register("birthdate", { required: true })}
                  className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                    errors.birthdate ? "border-red-500" : ""
                  }`}
                  type="date"
                  max={getMaxDate()}
                />
                {errors.birthdate && (
                  <span className="text-red-500">Birthdate is required</span>
                )}
              </div>
            </>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="street">
                  Street:
                </label>
                <input
                  {...register("street", { required: true })}
                  className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                    errors.street ? "border-red-500" : ""
                  }`}
                  type="text"
                />
                {errors.street && (
                  <span className="text-red-500">Street is required</span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="municipality">
                  Municipality:
                </label>
                <select
                  {...register("municipality", { required: true })}
                  className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                    errors.municipality ? "border-red-500" : ""
                  }`}
                  onChange={handleChangeMunicipality}
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((municipality, index) => (
                    <option key={index} value={municipality.name}>
                      {municipality.name}
                    </option>
                  ))}
                </select>
                {errors.municipality && (
                  <span className="text-red-500">Municipality is required</span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="barangay">
                  Barangay:
                </label>
                <select
                  {...register("barangay", { required: true })}
                  className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                    errors.barangay ? "border-red-500" : ""
                  }`}
                  onChange={handleChangeBarangay}
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((barangay, index) => (
                    <option key={index} value={barangay}>
                      {barangay}
                    </option>
                  ))}
                </select>
                {errors.barangay && (
                  <span className="text-red-500">Barangay is required</span>
                )}
              </div>

              <div className="flex justify-between gap-5">
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="province">
                    Province:
                  </label>
                  <input
                    {...register("province")}
                    className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                    type="text"
                    value="Bataan"
                    readOnly
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="zipCode">
                    Zip Code:
                  </label>
                  <input
                    {...register("zipCode")}
                    className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                    type="text"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="userRole">
                  User Role:
                </label>
                <select
                  {...register("userRole", { required: true })}
                  className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                    errors.userRole ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select a role</option>
                  <option value="customer">Customer</option>
                  <option value="retailer">Retailer</option>
                  <option value="distributor">Distributor</option>
                  <option value="manufacturer">Manufacturer</option>
                </select>
                {errors.userRole && (
                  <span className="text-red-500">User role is required</span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="email">
                  Email Address:
                </label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500">
                    Email address is required
                  </span>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="phone">
                  Phone Number:
                </label>
                <input
                  {...register("phone", { required: true })}
                  type="number"
                  className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <span className="text-red-500">Phone number is required</span>
                )}
              </div>

              <div className="flex justify-between gap-5">
                <div className="relative flex flex-col w-full">
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="absolute top-0 right-0 text-xl p-2 cursor-pointer text-gray-200"
                    onClick={togglePasswordVisibility}
                  />
                  <label className="font-semibold text-xl" htmlFor="password">
                    Password:
                  </label>
                  <input
                    {...register("password", { required: true })}
                    type={passwordVisible ? "text" : "password"}
                    className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <span className="text-red-500">Password is required</span>
                  )}
                </div>

                <div className="relative flex flex-col w-full">
                  <FontAwesomeIcon
                    icon={confirmPasswordVisible ? faEyeSlash : faEye}
                    className="absolute top-0 right-0 text-xl p-2 cursor-pointer text-gray-200"
                    onClick={toggleConfirmPasswordVisibility}
                  />
                  <label
                    className="font-semibold text-xl"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password:
                  </label>
                  <input
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) => value === watch("password"),
                    })}
                    type={confirmPasswordVisible ? "text" : "password"}
                    className={`mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.confirmPassword &&
                    errors.confirmPassword.type === "required" && (
                      <span className="text-red-500">
                        Confirm password is required
                      </span>
                    )}
                  {errors.confirmPassword &&
                    errors.confirmPassword.type === "validate" && (
                      <span className="text-red-500">Passwords must match</span>
                    )}
                </div>
              </div>
            </div>
          )}
          <div className="w-full mt-10 flex flex-col items-center justify-center gap-10">
            <div className="w-full flex justify-around font-bold">
              {currentStep > 1 && (
                <button
                  onClick={handleBackStep}
                  type="button"
                  className="text-lg px-3 py-1 rounded-md border-2 bg-white w-40 text-purple-200 border-purple-200 hover:bg-purple-200 duration-300 hover:text-white ease-in-out"
                >
                  Back
                </button>
              )}
              {currentStep >= 1 && currentStep <= 2 && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="text-lg px-3 py-1 rounded-md border-2 bg-purple-200 w-40 text-white border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                >
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="text-lg px-3 py-1 rounded-md border-2 bg-purple-200 w-40 text-white border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
                >
                  {isSigningUp ? "Signing Up..." : "Sign Up"}
                </button>
              )}
            </div>

            <p className="text-lg text-gray-200">
              Already have an account?{" "}
              <span className="font-bold text-purple-200 cursor-pointer">
                Sign In
              </span>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
