import React from 'react';
import TokenGenerator from '../components/TokenGenerator';
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Green check icon */}
        <div className="flex justify-center mb-4">
          <svg className="h-14 w-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15"/>
            <path stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-green-600 mb-2">Payment Successful!</h1>
        {/* Token Display */}
        <div className="bg-gray-50 rounded-xl py-6 px-4 my-4">
          <div className="text-gray-500 mb-1">Your Print Token</div>
          <div className="text-2xl font-mono font-extrabold tracking-wider text-gray-800">
            <TokenGenerator paymentSuccess={true} />
          </div>
        </div>
        <p className="text-gray-700 mb-4">Please use this token for document collection</p>
        <hr className="my-4" />
        <p className="text-base text-gray-500 mb-6">Thank you for using our printing service!</p>
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-3 rounded-xl mx-auto transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v11a1 1 0 01-1 1h-3" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;