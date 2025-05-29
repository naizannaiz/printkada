import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { usePrice } from "../context/PriceContext";

const PaymentQR = ({ pageCount = 1, onPaymentSuccess }) => {
  const { pricePerPage } = usePrice(); // Get price per page from context
  const cost = pageCount * pricePerPage;
  const randomString = Math.random().toString(36).substring(2, 10);
  const qrValue = `PAYMENT:${randomString}:AMOUNT:${cost}`;

  const handlePayNow = () => {
  // Just call onPaymentSuccess (no token argument needed)
  onPaymentSuccess();
};

  return (
    <div>
      <h2>Scan to Pay</h2>
      <QRCodeCanvas value={qrValue} size={200} />
      <br />
      <button onClick={handlePayNow}>I've Paid</button>
    </div>
  );
};

export default PaymentQR;