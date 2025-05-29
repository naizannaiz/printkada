import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentQR from "../components/PaymentQR";
import TokenGenerator from "../components/TokenGenerator";
import { usePrice } from "../context/PriceContext";

const PaymentPage = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { pricePerPage } = usePrice();
  const pageCount = location.state?.pageCount || 1;
  const total = pageCount * pricePerPage;

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    navigate('/success');
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