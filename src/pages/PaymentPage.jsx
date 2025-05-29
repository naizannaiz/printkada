import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentQR from "../components/PaymentQR";
import TokenGenerator from "../components/TokenGenerator";
import { usePrice } from "../context/PriceContext";
import "./PaymentPage.css";

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
    <div className="payment-page">
      <h1>Payment Page</h1>
      <p>Number of Pages: {pageCount}</p>
      <p>Price per Page: ₹{pricePerPage}</p>
      <p><strong>Total: ₹{total}</strong></p>
      {!paymentSuccess ? (
        <PaymentQR pageCount={pageCount} onPaymentSuccess={handlePaymentSuccess} />
      ) : (
        <TokenGenerator token={token} />
      )}
    </div>
  );
};

export default PaymentPage;