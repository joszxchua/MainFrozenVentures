import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import municipalitiesInBataan from "../../../municipalities";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";

export const Profile = () => {
  const { user } = useContext(UserContext);
  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    setValue: setValuePersonal,
    getValues: getValuesPersonal,
  } = useForm();
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    setValue: setValueAddress,
    getValues: getValuesAddress,
  } = useForm();
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [barangays, setBarangays] = useState([]);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [initialPersonalValues, setInitialPersonalValues] = useState({});
  const [initialAddressValues, setInitialAddressValues] = useState({});
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");

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

            const birthdate = new Date(userData.birthdate)
              .toISOString()
              .split("T")[0];

            setInitialPersonalValues({
              firstName: userData.firstName,
              lastName: userData.lastName,
              gender: userData.gender,
              birthdate: birthdate,
            });

            setInitialAddressValues({
              street: userData.street,
              municipality: userData.municipality,
              barangay: userData.barangay,
              province: userData.province,
              zipCode: userData.zipCode,
            });

            setValuePersonal("firstName", userData.firstName);
            setValuePersonal("lastName", userData.lastName);
            setValuePersonal("gender", userData.gender);
            setValuePersonal("birthdate", birthdate);

            setValueAddress("street", userData.street);
            setValueAddress("municipality", userData.municipality);
            setValueAddress("barangay", userData.barangay);
            setValueAddress("province", userData.province);
            setValueAddress("zipCode", userData.zipCode);
            setSelectedMunicipality(userData.municipality);
            setSelectedBarangay(userData.barangay);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user.accountId, setValuePersonal, setValueAddress]);

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

  const handleChangeMunicipality = (e) => {
    const selectedMunicipalityName = e.target.value;
    setSelectedMunicipality(selectedMunicipalityName);
    setSelectedBarangay("");
    setValueAddress("barangay", "");
    setValueAddress("zipCode", "");

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
        setValueAddress("zipCode", selectedBarangayObj.zipCode);
      }
    }
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

  const handleEditPersonalInfo = () => {
    setIsEditingPersonal(true);
  };

  const handleCancelEditPersonal = () => {
    setValuePersonal("firstName", initialPersonalValues.firstName);
    setValuePersonal("lastName", initialPersonalValues.lastName);
    setValuePersonal("gender", initialPersonalValues.gender);
    setValuePersonal("birthdate", initialPersonalValues.birthdate);
    setIsEditingPersonal(false);
  };

  const handleEditAddressInfo = () => {
    setIsEditingAddress(true);
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

  const onSubmitPersonal = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/account/personalUpdate",
        {
          ...data,
          accountId: user.accountId,
        }
      );
      if (response.data.status === "success") {
        setMessageTitle("Success");
        setMessage(response.data.message);
        setInitialPersonalValues(data);
      } else {
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
    }, 3000);
    setIsEditingPersonal(false);
  };

  const onSubmitAddress = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/account/addressUpdate",
        {
          ...data,
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
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      <h2 className="text-4xl font-bold">Profile</h2>

      <div className="mt-3">
        <div className="flex items-center">
          <p className="w-60 font-semibold text-gray-200">
            Personal Information
          </p>
          <div className="w-full border-t-2"></div>
        </div>

        <form
          onSubmit={handleSubmitPersonal(onSubmitPersonal)}
          className="flex flex-col items-center gap-5 py-5"
        >
          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="firstName" className="text-lg font-medium">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...registerPersonal("firstName")}
              disabled={!isEditingPersonal}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="lastName" className="text-lg font-medium">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...registerPersonal("lastName")}
              disabled={!isEditingPersonal}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="gender" className="text-lg font-medium">
              Gender:
            </label>
            <select
              className="text-lg px-2 py-2 rounded-lg border-2 border-black outline-purple-200"
              {...registerPersonal("gender")}
              disabled={!isEditingPersonal}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="birthdate" className="text-lg font-medium">
              Birthdate:
            </label>
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...registerPersonal("birthdate")}
              max={getMaxDate()}
              disabled={!isEditingPersonal}
            />
          </div>

          {isEditingPersonal ? (
            <div className="w-full flex justify-around">
              <button
                type="button"
                onClick={handleCancelEditPersonal}
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
                onClick={handleEditPersonalInfo}
                className="bg-purple-200 text-white font-bold text-lg px-3 py-1 rounded-md border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out"
              >
                Edit Personal Information
              </button>
            </div>
          )}
        </form>
      </div>

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
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
              {...registerAddress("street")}
              disabled={!isEditingAddress}
            />
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="municipality" className="text-lg font-medium">
              Municipality:
            </label>
            <select
              className="text-lg px-2 py-2 rounded-lg border-2 border-black outline-purple-200"
              {...registerAddress("municipality")}
              disabled={!isEditingAddress}
              onChange={handleChangeMunicipality}
            >
              <option value="">Select Municipality</option>
              {municipalitiesInBataan.map((municipality, index) => (
                <option key={index} value={municipality.name}>
                  {municipality.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="barangay" className="text-lg font-medium">
              Barangay:
            </label>
            <select
              className="text-lg px-2 py-2 rounded-lg border-2 border-black outline-purple-200"
              {...registerAddress("barangay")}
              disabled={!isEditingAddress}
              value={selectedBarangay}
              onChange={handleChangeBarangay}
            >
              <option value="">Select Barangay</option>
              {barangays.map((barangay, index) => (
                <option key={index} value={barangay}>
                  {barangay}
                </option>
              ))}
            </select>
          </div>

          <div className="w-[60%] flex flex-col gap-2">
            <label htmlFor="province" className="text-lg font-medium">
              Province:
            </label>
            <input
              type="text"
              name="province"
              id="province"
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
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
              className="text-lg px-2 py-1 rounded-lg border-2 border-black outline-purple-200"
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
