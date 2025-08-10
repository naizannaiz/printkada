# Razorpay Integration Setup Guide

This guide follows Razorpay's official documentation for Web Standard Checkout integration.

## Prerequisites

1. A Razorpay account (sign up at https://razorpay.com)
2. Node.js and npm installed
3. Your college printing shop application running

## Step 1: Get Razorpay API Keys

1. **Sign up/Login to Razorpay Dashboard**
   - Go to https://dashboard.razorpay.com
   - Sign up for a new account or login to existing account

2. **Get API Keys**
   - Navigate to Settings → API Keys
   - Generate a new key pair
   - Copy both the **Key ID** and **Key Secret**

3. **Test vs Live Keys**
   - Use **Test Keys** for development and testing
   - Use **Live Keys** for production
   - Test keys start with `rzp_test_`
   - Live keys start with `rzp_live_`

## Step 2: Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
PORT=5000
```

**Replace the placeholder values with your actual Razorpay API keys.**

## Step 3: Update Frontend Configuration

In `src/components/RazorpayPayment.jsx`, update the Razorpay key:

```javascript
// Line 108: Replace with your actual Key ID
key: 'rzp_test_YOUR_KEY_ID_HERE', // Replace with your actual Razorpay Key ID
```

## Step 4: Install Server Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

## Step 5: Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Integration Steps (Following Razorpay Documentation)

### Step 1.1: Create Order in Server

The order states and corresponding payment states:

| Payment Stages | Order State | Payment State | Description |
|----------------|-------------|---------------|-------------|
| Stage I | created | created | Customer submits payment information, sent to Razorpay. Payment not processed yet. |
| Stage II | attempted | authorized/failed | Order moves from created to attempted when payment is first attempted. |
| Stage III | paid | captured | After payment moves to captured state, order moves to paid state. |

**Important Notes:**
- An order should be created for every payment
- Use the Orders API (server-side call)
- The order_id received should be passed to checkout
- This ties the order with payment and secures the request

### Step 1.2: Integrate with Checkout on Client-Side

The checkout integration includes:

1. **Load Razorpay Script:**
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

2. **Configure Checkout Options:**
```javascript
var options = {
    "key": "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
    "amount": "50000", // Amount is in currency subunits
    "currency": "INR",
    "name": "College Printing Shop", // your business name
    "description": "Print Job Transaction",
    "image": "https://example.com/your_logo",
    "order_id": "order_9A33XWu170gUtm", // Order ID from Step 1.1
    "prefill": {
        "name": "Student Name",
        "email": "student@college.edu",
        "contact": "+919876543210"
    },
    "notes": {
        "address": "College Campus"
    },
    "theme": {
        "color": "#3B82F6"
    }
};
```

### Step 1.3: Handle Payment Success and Failure

**Payment Success:**
- Customer sees your website page
- Checkout returns response object with `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`
- Collect these and send to your server

**Payment Failure:**
- Handle failed payments appropriately
- Show error messages to user

### Step 1.4: Store Fields in Your Server

A successful payment returns:
```json
{
  "razorpay_payment_id": "pay_29QQoUBi66xm2f",
  "razorpay_order_id": "order_9A33XWu170gUtm",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

### Step 1.5: Verify Payment Signature (Mandatory)

This is a mandatory step to confirm authenticity:

1. **Create signature on your server:**
   - Use `order_id` from your server (not `razorpay_order_id`)
   - Use `razorpay_payment_id` returned by Checkout
   - Use `key_secret` from your server

2. **Generate HMAC hex digest:**
```javascript
generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);

if (generated_signature == razorpay_signature) {
    payment is successful
}
```

### Step 1.6: Verify Payment Status

You can track payment status in three ways:
1. Verify Status from Dashboard
2. Subscribe to Webhook Events
3. Poll APIs

## Test Integration

### Test Payment Credentials

**Test Cards:**
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **Name:** Any name

**Test UPI:**
- **UPI ID:** success@razorpay

**Test Net Banking:**
- **Bank:** Any test bank
- **Credentials:** Use any test credentials

### Test the Integration

1. **Start your React application:**
   ```bash
   npm start
   ```

2. **Test the payment flow:**
   - Upload a document
   - Proceed to payment page
   - Select "Razorpay" payment method
   - Click "Pay with Razorpay"
   - Complete the payment using test credentials

3. **Test the standalone HTML page:**
   - Open `http://localhost:3000/razorpay-test.html`
   - Follow the step-by-step test process

## API Endpoints

The server provides the following endpoints:

### 1. Create Order
```
POST /api/razorpay/order
Content-Type: application/json

{
  "amount": 100,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": {
    "fileName": "document.pdf",
    "pageCount": 5
  }
}
```

### 2. Verify Payment
```
POST /api/razorpay/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

### 3. Get Payment Details
```
GET /api/razorpay/payment/:paymentId
```

### 4. Get Order Details
```
GET /api/razorpay/order/:orderId
```

### 5. Health Check
```
GET /api/health
```

## Security Considerations

1. **Never expose your Key Secret in frontend code**
2. **Always verify payments on the server side**
3. **Use environment variables for sensitive data**
4. **Implement proper error handling**
5. **Log payment events for debugging**

## Production Deployment

### 3.1 Accept Live Payments

1. **Switch to Live Mode:**
   - Replace test keys with live keys
   - Update environment variables
   - Update frontend configuration

2. **Generate Live API Keys:**
   - Log in to Razorpay Dashboard
   - Switch to Live Mode
   - Navigate to Account & Settings → API Keys → Generate Key
   - Download and save keys securely

### 3.2 Payment Capture

**Auto-capture Payments (Recommended):**
- Configure global settings on Razorpay Dashboard
- Payments are automatically captured after authorization

**Manual Capture:**
- Capture payments manually using API
- Track payment status using Fetch Payment API or webhooks

### 3.3 Set Up Webhooks

1. **Configure webhooks in live mode:**
   - Set up webhook endpoints
   - Configure events for notifications
   - Handle payment status updates automatically

## Troubleshooting

### Common Issues

1. **"Invalid Key ID" Error**
   - Check if you're using correct key (test vs live)
   - Verify key format

2. **"Amount should be in paise" Error**
   - Ensure amount is multiplied by 100
   - Check if amount is integer

3. **CORS Errors**
   - Ensure CORS is properly configured
   - Check server URL in frontend

4. **Payment Verification Failed**
   - Verify signature calculation
   - Check if all parameters are present

### Debug Mode

Enable debug logging:
```javascript
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Enable debug mode
razorpay.setDebugMode(true);
```

## Files Modified/Created

1. `server/razorpay.js` - Backend server with Razorpay integration
2. `server/package.json` - Server dependencies
3. `src/components/RazorpayPayment.jsx` - Frontend Razorpay component
4. `src/pages/PaymentPage.jsx` - Updated payment page with Razorpay option
5. `public/razorpay-test.html` - Test page following Razorpay documentation
6. `.env` - Environment variables (create this file)

## Support

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay Support:** https://razorpay.com/support/
- **API Reference:** https://razorpay.com/docs/api/

## Next Steps

1. Test the integration thoroughly
2. Set up webhooks for production
3. Implement payment analytics
4. Add payment history tracking
5. Consider implementing subscription payments if needed 