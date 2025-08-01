import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrice } from "../context/PriceContext";
import { getStorage } from "firebase/storage";
import app, { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import PaymentQR from "../components/PaymentQR"; // <-- Import the PaymentQR component

export const storage = getStorage(app);

const PaymentPage = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { pricePerPageBlackwhite, pricePerPageColor } = usePrice();

  // Get details from location.state or sessionStorage as fallback
  const pageCount = location.state?.pageCount || 1;
  const fileName = location.state?.fileName || "Document.pdf";
  const colorType = location.state?.colorType || "Blackwhite";
  const sideType = location.state?.sideType || "Single";
  const copies = location.state?.copies || 1;
  const pricePerPage =
    colorType === "color" ? pricePerPageColor : pricePerPageBlackwhite;
  const total = pageCount * pricePerPage * copies;

  const handlePaymentSuccess = async () => {
    const paymentId = generatePaymentId();
    const token = generateToken();

    sessionStorage.setItem("printToken", token);
    localStorage.setItem("printToken", token);

    const tokens = JSON.parse(localStorage.getItem("printTokens") || "[]");
    tokens.push({ token, createdAt: Date.now() });
    localStorage.setItem("printTokens", JSON.stringify(tokens));

    const printRequestId = sessionStorage.getItem("printRequestId");
    if (printRequestId) {
      await updateDoc(doc(db, "printRequests", printRequestId), {
        paymentId,
        token,
        status: "paid",
        copies // <-- Add this line to update the number of copies in Firestore
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Complete Your Payment</h1>
      <p className="text-gray-500 mb-8 text-center">Review your print job and proceed with payment</p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl">
        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex-1 min-w-[320px]">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Document Name</span>
              <span className="font-medium">{fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Pages</span>
              <span className="font-medium">{pageCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Print Type</span>
              <span className="font-medium capitalize">{colorType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Print Side</span>
              <span className="font-medium capitalize">{sideType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Copies</span>
              <span className="font-medium">{copies}</span>
            </div>
            <div className="border-t pt-4 flex justify-between mt-4">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold text-lg text-gray-900">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {/* Payment Options Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex-1 min-w-[320px] flex flex-col items-center">
          <h2 className="font-semibold text-base mb-2">Payment Options</h2>
          <div className="w-full border rounded-xl p-4 flex flex-col items-center mb-2">
            <svg className="h-7 w-7 text-gray-700 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="font-medium mb-2">Pay via UPI</span>
            <PaymentQR pageCount={pageCount} onPaymentSuccess={handlePaymentSuccess} />
            <span className="text-gray-400 text-xs mt-2 text-center">
              Scan QR code using any UPI app
            </span>
          </div>
          {!paymentSuccess && (
            <button
              onClick={handlePaymentSuccess}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-base transition"
            >
              I have paid
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;