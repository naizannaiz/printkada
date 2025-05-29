import React from 'react';
import TokenGenerator from '../components/TokenGenerator';

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
        <TokenGenerator paymentSuccess={true} />
        <p className="mt-4 text-lg text-gray-700">Please keep this token safe for your reference.</p>
        <p className="mt-2 text-base text-gray-500">Thank you for using our printing service!</p>
      </div>
    </div>
  );
};

export default SuccessPage;