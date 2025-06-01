import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentQR from "../components/PaymentQR";
import TokenGenerator from "../components/TokenGenerator";
import { usePrice } from "../context/PriceContext";
import { getStorage } from "firebase/storage";
import app from "../firebase"; // Adjust the import based on your file structure
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export const storage = getStorage(app);

const PaymentPage = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { pricePerPage } = usePrice();
  const pageCount = location.state?.pageCount || 1;
  const total = pageCount * pricePerPage;

  const handlePaymentSuccess = async () => {
    const paymentId = generatePaymentId();
    const token = generateToken();

    sessionStorage.setItem("printToken", token);

    const printRequestId = sessionStorage.getItem("printRequestId");
    if (printRequestId) {
      await updateDoc(doc(db, "printRequests", printRequestId), {
        paymentId,
        token,
        status: "paid"
      });
    } else {
      alert("No print request found. Please start from the upload page.");
      return;
    }

    setPaymentSuccess(true);
    setToken(token);
    navigate('/success');
  };

  const generatePaymentId = () => "PAY" + Math.floor(100000 + Math.random() * 900000);

  const generateToken = () => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = Math.floor(Math.random() * 100).toString().padStart(2, "0");
    return `${letter}${digits}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Payment Page</h1>
        <div className="mb-4">
          <p className="text-lg text-gray-700">Number of Pages: <span className="font-semibold">{pageCount}</span></p>
          <p className="text-lg text-gray-700">Price per Page: <span className="font-semibold">₹{pricePerPage}</span></p>
          <p className="text-xl font-bold text-blue-800 mt-2">Total: ₹{total}</p>
        </div>
        {!paymentSuccess ? (
          <PaymentQR pageCount={pageCount} onPaymentSuccess={handlePaymentSuccess} />
        ) : (
          <TokenGenerator token={token} />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;