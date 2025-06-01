import React, { useState, useEffect } from "react";

const TokenGenerator = ({ paymentSuccess }) => {
  const [token, setToken] = useState("");

  const generateToken = () => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const digits = Math.floor(Math.random() * 100).toString().padStart(2, "0"); // 00-99
    return `${letter}${digits}`;
  };

  useEffect(() => {
    if (paymentSuccess) {
      let storedToken = sessionStorage.getItem("printToken");
      if (!storedToken) {
        storedToken = generateToken();
        sessionStorage.setItem("printToken", storedToken);
      }
      setToken(storedToken);
    }
  }, [paymentSuccess]);

  return (
    <div>
      {token ? (
        <div>
          <h2>Your Token Number:</h2>
          <p>{token}</p>
          <p>Please use this token for document collection.</p>
        </div>
      ) : (
        <p>Processing payment...</p>
      )}
    </div>
  );
};

export default TokenGenerator;