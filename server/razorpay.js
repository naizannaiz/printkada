const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
const app = express();

app.use(express.json());
app.use(cors());

// Initialize Razorpay with your keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_Kf2dTChwe7YKPR",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "eyWqblYqillu1jnMCgIYuJU7"
});

// Step 1.1: Create Order API (Server-side)
app.post("/api/razorpay/order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body;
    
    if (!amount) {
      return res.status(400).json({ 
        success: false,
        error: "Amount is required" 
      });
    }

    // Create order options as per Razorpay documentation
    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    };

    // Create order using Razorpay Orders API
    const order = await razorpay.orders.create(options);
    
    console.log("Order created successfully:", order.id);
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Step 1.5: Verify Payment Signature (Mandatory step)
app.post("/api/razorpay/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        error: "Missing payment verification parameters" 
      });
    }

    // Verify the payment signature as per Razorpay documentation
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "eyWqblYqillu1jnMCgIYuJU7")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log("Payment verification successful");
      res.json({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      console.error("Payment verification failed - signature mismatch");
      res.status(400).json({
        success: false,
        error: "Payment verification failed - invalid signature"
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Step 1.6: Verify Payment Status
app.get("/api/razorpay/payment/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    
    console.log("Payment status:", payment.status);
    
    res.json({
      success: true,
      payment: payment
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get order details
app.get("/api/razorpay/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await razorpay.orders.fetch(orderId);
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Razorpay server is running",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Razorpay server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});