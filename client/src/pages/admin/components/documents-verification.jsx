import React, { useState, useEffect } from "react";
import axios from "axios";
import { Confirmation } from "../../../components/confirmation";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const capitalizeFirstChar = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const DocumentsVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [expandedShopId, setExpandedShopId] = useState(null);
  const [changeDocument, setChangeDocument] = useState(null);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [currentFilter, setCurrentFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentsResponse = await axios.post(
          "http://localhost:8081/admin/documentsFetch"
        );
        if (documentsResponse.data.status === "success") {
          const unverifiedDocuments = documentsResponse.data.document.filter(
            (document) => document.isVerified === 0
          );
          setDocuments(unverifiedDocuments);
          setFilteredDocuments(unverifiedDocuments);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentFilter === "All") {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(
        documents.filter((doc) => doc.userRole === currentFilter.toLowerCase())
      );
    }
  }, [currentFilter, documents]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleShowButton = (shopID) => {
    setExpandedShopId(expandedShopId === shopID ? null : shopID);
  };

  const handleCloseButton = () => {
    setExpandedShopId(null);
  };

  const handleRejectDocument = () => {
    setConfirmationTitle("Reject Document");
    setConfirmationMessage("Are you sure you want to reject this document?");
    setChangeDocument(2);
  };

  const handleVerifyDocument = () => {
    setConfirmationTitle("Verify Document");
    setConfirmationMessage("Are you sure you want to verify this document?");
    setChangeDocument(1);
  };

  const handleCancelVerifyDocument = () => {
    setConfirmationTitle("");
    setConfirmationMessage("");
    setChangeDocument(null);
  };

  const handleYesConfirmation = async () => {
    setConfirmationTitle("");
    setConfirmationMessage("");
    setChangeDocument(null);

    if (expandedShopId) {
      try {
        const statusResponse = await axios.post(
          "http://localhost:8081/admin/updateIsVerified",
          {
            shopId: expandedShopId,
            isVerified: changeDocument,
          }
        );
        if (statusResponse.data.status === "success") {
          setMessageTitle("Success");
          setMessage(statusResponse.data.message);
          setDocuments((prevDocuments) =>
            prevDocuments.filter((doc) => doc.shopID !== expandedShopId)
          );
          setExpandedShopId(null);
        } else {
          setMessageTitle("Error");
          setMessage("Something went wrong");
        }
      } catch (error) {
        console.log(error);
        setMessageTitle("Error");
        setMessage("Something went wrong");
      }
    }
    setTimeout(() => {
      setMessageTitle("");
      setMessage("");
    }, 3000);
  };

  return (
    <>
      {messageTitle && messageTitle === "Error" && (
        <ErrorMessage title={messageTitle} message={message} />
      )}
      {messageTitle && messageTitle === "Success" && (
        <SuccessMessage title={messageTitle} message={message} />
      )}
      {confirmationTitle && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 z-30">
          <Confirmation
            confirmationTitle={confirmationTitle}
            confirmationMessage={confirmationMessage}
            cancelConfirmation={handleCancelVerifyDocument}
            yesConfirmation={handleYesConfirmation}
          />
        </div>
      )}
      <div className="flex gap-3 text-4xl font-bold">
        <FontAwesomeIcon icon={faFile} />
        <h2>Documents Verification</h2>
      </div>

      <div className="relative min-h-[70vh] max-h-[70vh] overflow-auto">
        <div className="mt-5 flex gap-5">
          {["All", "Retailer", "Distributor", "Manufacturer"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`w-fit px-3 py-1 rounded-md border-2 font-bold text-lg ${
                currentFilter === filter
                  ? "bg-purple-200 text-white border-purple-200"
                  : "bg-white text-purple-200 border-purple-200 hover:bg-purple-200 duration-300 hover:text-white ease-in-out"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((document) => (
            <div
              key={document.shopID}
              className="bg-gray-100 mt-5 px-4 py-3 rounded-lg"
            >
              <div className="bg-white flex items-center px-4 py-3 rounded-lg">
                <img
                  src={`http://localhost:8081/shopLogos/${document.shopLogo}`}
                  alt="Product Image"
                  className="w-[70px] h-[70px] rounded-2xl"
                />

                <div className="w-full flex justify-between gap-1 px-5">
                  <div className="w-full">
                    <h3 className="font-bold text-xl">
                      {document.firstName} {document.lastName}
                    </h3>
                    <p>{capitalizeFirstChar(document.userRole)}</p>
                  </div>

                  <p className="w-full text-lg">
                    <span className="font-semibold">Shop's Name: </span>{" "}
                    {document.shopName}
                  </p>

                  <div className="w-full">
                    <p className="font-semibold">Shop Document:</p>
                    {document.shopDocument ? (
                      <a
                        href={`http://localhost:8081/shopDocuments/${document.shopDocument}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        {document.shopDocument}
                      </a>
                    ) : (
                      <p>No Document</p>
                    )}
                  </div>

                  <div className="h-fit px-3 py-2 rounded-full hover:bg-gray-100 duration-300 ease-in-out">
                    {expandedShopId === document.shopID ? (
                      <FontAwesomeIcon
                        onClick={handleCloseButton}
                        icon={faChevronUp}
                        className="cursor-pointer"
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => handleShowButton(document.shopID)}
                        icon={faChevronDown}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>
              {expandedShopId === document.shopID && (
                <div className="flex flex-col items-end mt-3">
                  <div className="flex items-center justify-between bg-white w-[75%] px-3 py-2 rounded-lg">
                    <button
                      onClick={handleRejectDocument}
                      className="w-fit px-3 py-1 rounded-lg bg-red-200 text-white font-bold text-lg border-2 border-red-200 hover:bg-white duration-300 hover:text-red-200 ease-in-out"
                    >
                      Reject Document
                    </button>
                    <button
                      onClick={handleVerifyDocument}
                      className="w-fit px-3 py-1 rounded-lg bg-green-200 text-white font-bold text-lg border-2 border-green-200 hover:bg-white duration-300 hover:text-green-200 ease-in-out"
                    >
                      Verify Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-3">
            <h2 className="text-4xl font-bold">No Documents</h2>
            <p className="text-lg text-center">
              No documents found based on the selected filter
            </p>
          </div>
        )}
      </div>
    </>
  );
};
