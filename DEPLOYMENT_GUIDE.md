
## Problem
Your React app is deployed on Vercel, but the payment gateway isn't working because:
1. Vercel only hosts frontend applications
2. Your Razorpay server runs on `localhost:5000` which doesn't exist in production
3. Vercel can't run Node.js servers

## Solution: Deploy Backend Separately

### Step 1: Deploy Backend to Railway (Recommended)

#### Option A: Railway (Free tier available)
1. **Sign up for Railway**: Go to [railway.app](https://railway.app) and create an account
2. **Create new project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select your repository**: Choose your college-printing-shop repo
4. **Configure deployment**:
   - Set root directory to `server/`
   - Railway will automatically detect it's a Node.js app
5. **Set environment variables**:
   ```
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
6. **Deploy**: Railway will automatically deploy your server
7. **Get your server URL**: Copy the Railway app URL (e.g., `https://your-app.railway.app`)

#### Option B: Render (Alternative)
1. **Sign up for Render**: Go to [render.com](https://render.com)
2. **Create new Web Service**: Connect your GitHub repo
3. **Configure**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Set environment variables** (same as Railway)
5. **Deploy**

#### Option C: Heroku (Paid)
1. **Sign up for Heroku**: Go to [heroku.com](https://heroku.com)
2. **Create new app**: Connect your GitHub repo
3. **Configure**: Set root directory to `server/`
4. **Set environment variables**
5. **Deploy**

### Step 2: Update Frontend Configuration

1. **Set environment variable in Vercel**:
   - Go to your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-railway-app.railway.app`

2. **Redeploy your Vercel app**:
   - Push changes to GitHub
   - Vercel will automatically redeploy

### Step 3: Test the Integration

1. **Test health check**: Visit `https://your-railway-app.railway.app/api/health`
2. **Test payment flow**: Try making a test payment on your Vercel app

## Alternative Solution: Serverless Functions (Advanced)

If you prefer to keep everything on Vercel, you can use Vercel Serverless Functions:

### Create API Routes in Vercel

1. **Create `api` folder**: In your project root, create `api/razorpay/order.js`
2. **Move server logic**: Convert your Express routes to serverless functions
3. **Update frontend**: Point to `/api/razorpay/order` instead of external URLs

Example serverless function:
```javascript
// api/razorpay/order.js
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = "INR", receipt, notes } = req.body;
    
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}
```

## Environment Variables Setup

### For Railway/Render/Heroku (Backend):
```
RAZORPAY_KEY_ID=rzp_live_Kf2dTChwe7YKPR
RAZORPAY_KEY_SECRET=your_actual_secret_key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### For Vercel (Frontend):
```
REACT_APP_API_URL=https://your-railway-app.railway.app
```

## Security Notes

1. **Never commit API keys**: Use environment variables
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate CORS**: Ensure your backend only accepts requests from your frontend domain
4. **Rate limiting**: Consider adding rate limiting to your API endpoints

## Troubleshooting

### Common Issues:

1. **CORS errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **API not found**: Verify the Railway app URL is correct
3. **Payment verification fails**: Check if Razorpay keys are correct
4. **Environment variables not loading**: Restart your deployment after adding env vars

### Testing Locally:

1. **Backend**: `cd server && npm start`
2. **Frontend**: `npm start`
3. **Test payment**: Use Razorpay test mode first

## Recommended Approach

**Use Railway for backend deployment** because:
- Free tier available
- Easy deployment from GitHub
- Automatic HTTPS
- Good performance
- Easy environment variable management

This will solve your Vercel payment gateway issue completely! 