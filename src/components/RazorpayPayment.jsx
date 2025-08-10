import React, { useEffect, useState } from 'react';
import { usePrice } from '../context/PriceContext';
import { API_ENDPOINTS } from '../config/api';

const RazorpayPayment = ({ 
  amount, 
  orderDetails, 
  onPaymentSuccess, 
  onPaymentFailure,
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { pricePerPageBlackwhite, pricePerPageColor } = usePrice();

  // Load Razorpay script as per documentation
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Step 1.1: Create Order (Server-side call)
  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.CREATE_ORDER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            fileName: orderDetails.fileName,
            pageCount: orderDetails.pageCount,
            colorType: orderDetails.colorType,
            sideType: orderDetails.sideType,
            copies: orderDetails.copies,
            totalAmount: amount
          }
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      console.log('Order created:', data.order.id);
      return data.order;
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Step 1.5: Verify Payment Signature (Mandatory step)
  const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_PAYMENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      console.log('Payment verified successfully');
      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  // Step 1.2: Integrate with Checkout (Client-side)
  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1.1: Create order first
      const order = await createOrder();

      // Step 1.2: Configure Razorpay options as per documentation
      const options = {
        key: 'rzp_live_Kf2dTChwe7YKPR', // Replace with your actual Razorpay Key ID
        amount: order.amount, // Amount in paise (already converted on server)
        currency: order.currency,
        name: 'College Printing Shop',
        description: `Print Job - ${orderDetails.fileName}`,
        image: 'https://razorpay.com/favicon.png', // Your business logo
        order_id: order.id, // Order ID from Step 1.1
        handler: async function (response) {
          try {
            console.log('Payment success response:', response);
            
            // Step 1.5: Verify Payment Signature
            const verificationResult = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verificationResult.success) {
              // Step 1.6: Verify Payment Status (Optional)
              const paymentStatusResponse = await fetch(`${API_ENDPOINTS.PAYMENT_STATUS}/${response.razorpay_payment_id}`);
              const paymentStatus = await paymentStatusResponse.json();
              
              console.log('Payment status:', paymentStatus.payment.status);

              // Call success callback with all payment data
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: amount,
                verificationData: verificationResult,
                paymentStatus: paymentStatus.payment
              });
            } else {
              onPaymentFailure('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onPaymentFailure(error.message);
          }
        },
        prefill: {
          name: 'Student',
          email: 'student@college.edu',
          contact: '' // Phone number for better conversion rates
        },
        notes: {
          fileName: orderDetails.fileName,
          pageCount: orderDetails.pageCount,
          colorType: orderDetails.colorType,
          sideType: orderDetails.sideType,
          copies: orderDetails.copies,
          address: 'College Campus'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            onClose && onClose();
          }
        },
        // Optional: Set timeout for checkout
        timeout: 300, // 5 minutes
        // Optional: Remember customer for saved cards
        remember_customer: true
      };

      // Initialize Razorpay checkout
      const rzp = new window.Razorpay(options);

      // Step 1.3: Handle Payment Success and Failure
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        onPaymentFailure(response.error.description || 'Payment failed');
      });

      // Open Razorpay checkout
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
      onPaymentFailure && onPaymentFailure(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pay with Razorpay</h3>
          <div className="flex items-center space-x-2">
            <img 
              src="https://razorpay.com/favicon.png" 
              alt="Razorpay" 
              className="w-6 h-6"
            />
            <span className="text-sm text-gray-600">Secure Payment</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-xl font-bold text-gray-900">₹{amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>• Secure payment powered by Razorpay</p>
            <p>• Multiple payment options: Cards, UPI, Net Banking</p>
            <p>• Instant payment confirmation</p>
            <p>• PCI DSS compliant</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Order...
              </div>
            ) : (
              `Pay ₹${amount.toFixed(2)}`
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment; 