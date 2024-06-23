import React, { useEffect, useState } from "react";

export const Message = ({ title, message }) => {
  const [bgColor, setBgColor] = useState("");
  const [fontColor, setFontColor] = useState("");

  useEffect(() => {
    if (title.toLowerCase() === "Error") {
      setBgColor("bg-red-100");
      setFontColor("text-red-500");
    } else if (title.toLowerCase() === "Success") {
      setBgColor("bg-green-100");
      setFontColor("text-green-500");
    } else {
      setBgColor("bg-gray-100");
      setFontColor("text-gray-500");
    }
  }, [title]);

  return (
    <div className={`flex flex-col gap-3 px-5 py-3 font-inter ${bgColor} ${fontColor}`}>
      <h4 className="font-bold text-xl">{title}!</h4>
      <p className="text-lg">{message}</p>
    </div>
  );
};