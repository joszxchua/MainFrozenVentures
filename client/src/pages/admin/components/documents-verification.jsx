import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export const DocumentsVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [expandedShopId, setExpandedShopId] = useState(null);

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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleShowButton = (shopID) => {
    setExpandedShopId(expandedShopId === shopID ? null : shopID);
  };

  const handleCloseButton = () => {
    setExpandedShopId(null);
  };

  return (
    <>
      <div className="flex gap-3 text-4xl font-bold">
        <FontAwesomeIcon icon={faFile} />
        <h2>Documents Verification</h2>
      </div>

      <div className="relative min-h-[70vh] max-h-[70vh]">
        {documents.length > 0 ? (
          documents.map((document) => (
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
                    <p>{document.userRole}</p>
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
                  <button className="w-[75%] py-2 rounded-lg bg-purple-200 text-white font-bold text-lg border-2 border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out">
                    Verify Document
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-3">
            <h2 className="text-4xl font-bold">No Orders</h2>
            <p className="text-lg text-center">
              Effortlessly manage and track your incoming orders, simplifying
              your workflow and enhancing productivity
            </p>
          </div>
        )}
      </div>
    </>
  );
};
