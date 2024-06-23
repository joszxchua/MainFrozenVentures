import React, { useState, useEffect } from "react";
import municipalitiesInBataan from "../../../municipalities";

export const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthdate: "",
  });
  const [addressInfo, setAddressInfo] = useState({
    street: "",
    barangay: "",
    municipality: "",
    province: "Bataan",
    zipCode: "",
  });
  const [accountInfo, setAccountInfo] = useState({
    userRole: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [barangays, setBarangays] = useState([]);

  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
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
    if (selectedMunicipality) {
      const selectedMunicipalityObj = municipalitiesInBataan.find(
        (municipality) => municipality.name === selectedMunicipality
      );
      if (selectedMunicipalityObj) {
        setBarangays(
          selectedMunicipalityObj.barangays.map((barangay) => ({
            name: barangay.name,
            zipCode: barangay.zipCode,
          }))
        );
      }
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    const selectedBarangay = barangays.find(
      (barangay) => barangay.name === addressInfo.barangay
    );
    if (selectedBarangay) {
      setAddressInfo((prevAddress) => ({
        ...prevAddress,
        zipCode: selectedBarangay.zipCode,
      }));
    }
  }, [addressInfo.barangay, barangays]);

  const handleChangeMunicipality = (e) => {
    setSelectedMunicipality(e.target.value);
    setAddressInfo({
      ...addressInfo,
      municipality: e.target.value,
      barangay: "",
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    
    console.log("Signing up with:", personalInfo, addressInfo, accountInfo);
  };

  return (
    <>
      <div className="w-full flex flex-col">
        <form action="" className="flex flex-col justify-center gap-10">
          {currentStep === 1 && (
            <>
              <div className="flex justify-between gap-5">
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="firstName">
                    First Name:
                  </label>
                  <input
                    className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="lastName">
                    Last Name:
                  </label>
                  <input
                    className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="gender">
                  Gender:
                </label>
                <select
                  className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                  name="gender"
                  id="gender"
                  value={personalInfo.gender}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, gender: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select your gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="birthdate">
                  Birthday:
                </label>
                <input
                  className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                  type="date"
                  name="birthdate"
                  id="birthdate"
                  value={personalInfo.birthdate}
                  max={getMaxDate()}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      birthdate: e.target.value,
                    })
                  }
                />
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
                  className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                  type="text"
                  id="street"
                  name="street"
                  value={addressInfo.street}
                  onChange={(e) =>
                    setAddressInfo({ ...addressInfo, street: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="municipality">
                  Municipality:
                </label>
                <select
                  className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                  id="municipality"
                  name="municipality"
                  value={addressInfo.municipality}
                  onChange={handleChangeMunicipality}
                >
                  <option value="" disabled>
                    Select Municipality
                  </option>
                  {municipalities.map((municipality, index) => (
                    <option key={index} value={municipality.name}>
                      {municipality.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="barangay">
                  Barangay:
                </label>
                <select
                  className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                  id="barangay"
                  name="barangay"
                  value={addressInfo.barangay}
                  onChange={(e) =>
                    setAddressInfo({ ...addressInfo, barangay: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Barangay
                  </option>
                  {barangays.map((barangay, index) => (
                    <option key={index} value={barangay.name}>
                      {barangay.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between gap-5">
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="province">
                    Province:
                  </label>
                  <input
                    className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                    type="text"
                    id="province"
                    name="province"
                    value={addressInfo.province}
                    readOnly
                  />
                </div>
                <div className="  flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="zipCode">
                    Zip Code:
                  </label>
                  <input
                    className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={addressInfo.zipCode}
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
                  id="userRole"
                  name="userRole"
                  value={accountInfo.userRole}
                  onChange={(e) =>
                    setAccountInfo({
                      ...accountInfo,
                      userRole: e.target.value,
                    })
                  }
                  className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="customer">Customer</option>
                  <option value="retailer">Retailer</option>
                  <option value="distributor">Distributor</option>
                  <option value="manufacturer">Manufacturer</option>
                </select>
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="emailAdd">
                  Email Address:
                </label>
                <input
                  type="email"
                  id="emailAdd"
                  name="emailAdd"
                  value={accountInfo.email}
                  onChange={(e) =>
                    setAccountInfo({ ...accountInfo, email: e.target.value })
                  }
                  className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-semibold text-xl" htmlFor="phone">
                  Phone:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={accountInfo.phone}
                  onChange={(e) =>
                    setAccountInfo({ ...accountInfo, phone: e.target.value })
                  }
                  className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                />
              </div>

              <div className="flex justify-between gap-5">
                <div className="flex flex-col w-full">
                  <label className="font-semibold text-xl" htmlFor="password">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={accountInfo.password}
                    onChange={(e) =>
                      setAccountInfo({
                        ...accountInfo,
                        password: e.target.value,
                      })
                    }
                    className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    className="font-semibold text-xl"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={accountInfo.confirmPassword}
                    onChange={(e) =>
                      setAccountInfo({
                        ...accountInfo,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="mt-3 bg-gray-100 p-3 rounded-lg border-b-2 border-r-2 border-purple-200 focus:border-purple-200 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="w-full mt-10 flex flex-col items-center justify-center gap-10">
          <div className="w-full flex justify-around font-bold">
            {currentStep > 1 && (
              <button
                onClick={handleBackStep}
                className="text-lg px-3 py-1 rounded-md border-2 bg-white w-40 text-purple-200 border-purple-200 hover:bg-purple-200 duration-300 hover:text-white ease-in-out"
              >
                Back
              </button>
            )}
            {currentStep >= 1 && currentStep <= 2 && (
              <button
                onClick={handleNextStep}
                className="text-lg px-3 py-1 rounded-md border-2 bg-purple-200 w-40 text-white border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={handleSignUp}
                className="text-lg px-3 py-1 rounded-md border-2 bg-purple-200 w-40 text-white border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Sign Up
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
      </div>
    </>
  );
};
