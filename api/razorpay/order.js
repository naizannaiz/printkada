import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_Kf2dTChwe7YKPR",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "eyWqblYqillu1jnMCgIYuJU7",
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
