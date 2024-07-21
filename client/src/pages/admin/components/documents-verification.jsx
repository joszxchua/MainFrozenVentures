import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

export const DocumentsVerification = () => {
  return (
    <>
      <div className="flex gap-3 text-4xl font-bold">
        <FontAwesomeIcon icon={faFile} />
        <h2>Documents Verification</h2>
      </div>

      <div className="min-h-[70vh] max-h-[70vh]"></div>
    </>
  );
};
