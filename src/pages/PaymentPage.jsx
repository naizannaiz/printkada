import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrice } from "../context/PriceContext";
import { getStorage } from "firebase/storage";
import app, { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import RazorpayPayment from "../components/RazorpayPayment";

export const storage = getStorage(app);

const PaymentPage = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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

  const handlePaymentSuccess = async (paymentData = null) => {
    try {
      setIsProcessingPayment(true);
      
      const paymentId = paymentData?.paymentId || generatePaymentId();
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
          copies,
          paymentMethod: "razorpay",
          razorpayOrderId: paymentData?.orderId,
          razorpayPaymentId: paymentData?.paymentId,
          paymentAmount: total
        });
      } else {
        alert("No print request found. Please start from the upload page.");
        setIsProcessingPayment(false);
        return;
      }

      setPaymentSuccess(true);
      setToken(token);
      setShowPaymentModal(false);
      
      // Add a small delay to show the loading screen
      setTimeout(() => {
        navigate('/success');
      }, 2000);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    alert(`Payment failed: ${error}`);
    setShowPaymentModal(false);
  };

  const generatePaymentId = () => "PAY" + Math.floor(100000 + Math.random() * 900000);

  const generateToken = () => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = Math.floor(Math.random() * 100).toString().padStart(2, "0");
    return `${letter}${digits}`;
  };

  const orderDetails = {
    fileName,
    pageCount,
    colorType,
    sideType,
    copies,
    total
  };

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h2>
        <p className="text-gray-600 mb-4">Please wait while we process your payment and generate your print token...</p>
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Verifying payment</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Updating database</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Generating token</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Complete Your Payment</h1>
      <p className="text-gray-500 mb-8 text-center">Review your print job and proceed with payment</p>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
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

        {/* Razorpay Payment Card */}
        <div className="bg-white rounded-2xl shadow p-6 flex-1 min-w-[320px]">
          <h2 className="font-semibold text-base mb-4">Secure Payment</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <img 
                  src="https://razorpay.com/favicon.png" 
                  alt="Razorpay" 
                  className="w-6 h-6 mr-2"
                />
                <span className="text-blue-800 font-medium">Razorpay Payment Gateway</span>
              </div>
              <p className="text-blue-700 text-sm">
                Pay securely using cards, UPI, net banking, and more payment options.
              </p>
            </div>
            
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={isProcessingPayment}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                isProcessingPayment 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessingPayment ? 'Processing...' : `Pay ₹${total.toFixed(2)} with Razorpay`}
            </button>
          </div>
        </div>
      </div>

      {/* Razorpay Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <RazorpayPayment
              amount={total}
              orderDetails={orderDetails}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
              onClose={() => setShowPaymentModal(false)}
            />
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {isProcessingPayment && <LoadingScreen />}
    </div>
  );
};

export default PaymentPage;