import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { usePrice } from "../context/PriceContext";

const PaymentQR = ({ pageCount = 1 }) => {
  const { pricePerPage } = usePrice();
  const cost = pageCount * pricePerPage;
  const randomString = Math.random().toString(36).substring(2, 10);
  const qrValue = `PAYMENT:${randomString}:AMOUNT:${cost}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Scan to Pay</h2>
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center justify-center">
        <QRCodeCanvas value={qrValue} size={200} />
      </div>
    </div>
  );
};

export default PaymentQR;