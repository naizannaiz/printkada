import React from 'react';
import TokenGenerator from '../components/TokenGenerator';
import "./SuccessPage.css";

const SuccessPage = () => {
  return (
    <div className="success-page">
      <h1>Payment Successful!</h1>
      <TokenGenerator paymentSuccess={true} />
      <p>Please keep this token safe for your reference.</p>
      <p>Thank you for using our printing service!</p>
    </div>
  );
};

export default SuccessPage;