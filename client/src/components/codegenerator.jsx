import React, { useState } from "react";
import emailjs from "@emailjs/browser";

export const CodeGenerator = ({ inputEmail, setCode }) => {
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [sending, setSending] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    const min = 10000;
    const max = 99999;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    setCode(code.toString());
    setCodeGenerated(true);
    setSending(true);

    emailjs
      .send(
        "service_yrqqfsg",
        "template_020stgg",
        {
          email: inputEmail,
          code: code.toString(),
          subject: "Verification Code",
        },
        "kPDIxzyq9fPhvJqKS"
      )
      .then((response) => {
        console.log("Email sent successfully!", response);
        setSending(false);
      })
      .catch((error) => {
        console.error("Email send failed!", error);
        setSending(false);
      });
  };

  return (
    <div className="mt-5 flex justify-center">
      <button className="text-lg px-3 py-1 rounded-md border-2 bg-purple-200 w-40 text-white border-purple-200 hover:bg-white duration-300 hover:text-purple-200 ease-in-out" onClick={handleClick} disabled={sending}>
        {sending ? "Sending..." : codeGenerated ? "Resend Code" : "Send Code"}
      </button>
    </div>
  );
};
