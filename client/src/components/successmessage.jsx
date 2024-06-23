import React from "react";

export const SuccessMessage = ({ title, message }) => {
  return (
    <div className={`fixed top-10 left-[50%] translate-x-[-50%] flex flex-col items-center gap-1 px-5 py-3 font-inter rounded-lg bg-green-100 text-green-200`}>
      <h4 className="font-bold text-3xl">{title}!</h4>
      <p className="font-medium text-xl">{message}</p>
    </div>
  );
};