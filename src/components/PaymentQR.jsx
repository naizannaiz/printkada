import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { usePrice } from "../context/PriceContext";

const PaymentQR = ({ pageCount = 1, onPaymentSuccess }) => {
  const { pricePerPage } = usePrice();
  const cost = pageCount * pricePerPage;
  const randomString = Math.random().toString(36).substring(2, 10);
  const qrValue = `PAYMENT:${randomString}:AMOUNT:${cost}`;

  const handlePayNow = () => {
    onPaymentSuccess();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Scan to Pay</h2>
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center justify-center">
        <QRCodeCanvas value={qrValue} size={200} />
      </div>
      <button
        onClick={handlePayNow}
        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        I've Paid
      </button>
    </div>
  );
};

export default PaymentQR;