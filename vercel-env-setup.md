# Vercel Environment Variables Setup

## Quick Fix for Payment Gateway

Since Railway CORS is causing issues, let's use Vercel serverless functions instead.

### Step 1: Set Vercel Environment Variables

Go to your Vercel dashboard: https://vercel.com

1. **Select your project**: `printshop-phi`
2. **Go to Settings** → **Environment Variables**
3. **Add these variables**:

```
RAZORPAY_KEY_ID=rzp_live_Kf2dTChwe7YKPR
RAZORPAY_KEY_SECRET=your_actual_secret_key
```

### Step 2: Deploy

After adding the environment variables:
1. **Push your changes to GitHub**
2. **Vercel will automatically redeploy**
3. **The payment gateway will work immediately**

### Step 3: Test

1. **Go to your app**: https://printshop-phi.vercel.app
2. **Try the payment flow**
3. **It should work without CORS errors**

## Why This Works

- Vercel serverless functions run on the same domain as your frontend
- No CORS issues since it's same-origin
- Faster response times
- No external dependencies

## Files Created

- `api/razorpay/order.js` - Creates Razorpay orders
- `api/razorpay/verify.js` - Verifies payments
- Updated `src/config/api.js` - Points to Vercel functions

This will fix your payment gateway immediately!
