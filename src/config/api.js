// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000',
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://your-railway-app.railway.app',
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_BASE_URL = API_CONFIG[environment].baseURL;

// API endpoints
export const API_ENDPOINTS = {
  CREATE_ORDER: `${API_BASE_URL}/api/razorpay/order`,
  VERIFY_PAYMENT: `${API_BASE_URL}/api/razorpay/verify`,
  PAYMENT_STATUS: `${API_BASE_URL}/api/razorpay/payment`,
  HEALTH_CHECK: `${API_BASE_URL}/api/health`,
};

export default API_CONFIG; 