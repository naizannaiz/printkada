# Automatic Cleanup System Setup Guide

This guide will help you set up an automatic cleanup system that deletes print requests older than 24 hours from Firebase Firestore and their associated PDF files from Firebase Storage.

## 🎯 What This System Does

- **Automatic Cleanup**: Runs every 6 hours to delete old data
- **Firestore Cleanup**: Removes print requests older than 24 hours
- **Storage Cleanup**: Deletes associated PDF files from Firebase Storage
- **Manual Control**: Provides API endpoints for manual cleanup and monitoring

## 📋 Prerequisites

1. Firebase project with Firestore and Storage enabled
2. Node.js installed on your server
3. Access to Firebase Console

## 🔧 Step 1: Get Firebase Service Account Key

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com
   - Select your project (`printshop-10`)

2. **Navigate to Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

3. **Go to Service Accounts Tab**
   - Click on "Service accounts" tab
   - Click "Generate new private key"

4. **Download and Configure**
   - Click "Generate key" button
   - Download the JSON file
   - **Copy the downloaded file to `server/serviceAccountKey.json`**
   - **⚠️ IMPORTANT: This file is now protected by .gitignore and will NOT be committed to GitHub**

## 🔧 Step 2: Install Dependencies

Navigate to the server directory and install the new dependency:

```bash
cd server
npm install
```

## 🔧 Step 3: Configure Environment Variables

Create a `.env` file in the server directory:

```bash
# Copy the example file
cp server/env.example server/.env
```

Then edit `server/.env` with your actual values:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=printshop-10
FIREBASE_STORAGE_BUCKET=printshop-10.firebasestorage.app

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret

# Cleanup Configuration
CLEANUP_INTERVAL_HOURS=6
CLEANUP_RETENTION_HOURS=24

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANT: The `.env` file is protected by .gitignore and will NOT be committed to GitHub**

## 🚀 Step 4: Start the Cleanup Service

### Development Mode (with auto-restart):
```bash
npm run cleanup:dev
```

### Production Mode:
```bash
npm run cleanup
```

## 📊 API Endpoints

The cleanup service provides the following endpoints:

### 1. Manual Cleanup
```bash
POST http://localhost:5001/api/cleanup
```
Triggers immediate cleanup of old requests and files.

**Response:**
```json
{
  "success": true,
  "firestoreDeleted": 5,
  "storageDeleted": 3,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Cleanup Statistics
```bash
GET http://localhost:5001/api/cleanup/stats
```
Shows how many old requests are pending deletion.

**Response:**
```json
{
  "success": true,
  "oldRequestsCount": 3,
  "cutoffTime": "2024-01-14T10:30:00.000Z",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Health Check
```bash
GET http://localhost:5001/api/health
```
Checks if the cleanup service is running.

## 🔄 Automatic Scheduling

The cleanup service automatically:

1. **Runs on Startup**: Performs cleanup immediately when started
2. **Scheduled Execution**: Runs every 6 hours automatically
3. **Logs Activity**: Provides detailed console logs of all operations

## 🛡️ Safety Features

- **Error Handling**: Continues processing even if individual files fail to delete
- **Logging**: Detailed logs for monitoring and debugging
- **Non-blocking**: Storage deletion failures don't prevent Firestore cleanup
- **Graceful Degradation**: Service continues running even with errors

## 📈 Monitoring

### Console Logs
The service provides detailed console output:
```
Starting cleanup process...
Deleting requests older than: 2024-01-14T10:30:00.000Z
Found 5 documents to delete
Deleting storage file: pdfs/1705312200000_document.pdf
Successfully deleted storage file: pdfs/1705312200000_document.pdf
Deleted document: abc123def456
Cleanup completed!
- Firestore documents deleted: 5
- Storage files deleted: 3
```

### API Monitoring
Use the stats endpoint to monitor pending deletions:
```bash
curl http://localhost:5001/api/cleanup/stats
```

## 🚀 Deployment Options

### Option 1: Railway Deployment
1. Add the cleanup service to your Railway project
2. Set environment variables in Railway dashboard
3. Deploy the service

### Option 2: Local Server
1. Run on a dedicated server or VPS
2. Use PM2 or similar process manager
3. Set up monitoring and alerts

### Option 3: Cloud Functions (Alternative)
If you prefer serverless, you can convert this to Firebase Cloud Functions.

## 🔧 Configuration Options

### Customize Cleanup Interval
Edit `cleanup.js` to change the cleanup frequency:

```javascript
// Change from 6 hours to 12 hours
const CLEANUP_INTERVAL = 12 * 60 * 60 * 1000;
```

### Customize Retention Period
Edit the cleanup function to change retention period:

```javascript
// Change from 24 hours to 48 hours
const oneDayAgo = new Date();
oneDayAgo.setHours(oneDayAgo.getHours() - 48);
```

## 🔒 Security & Privacy

### Protected Files
The following files are protected by `.gitignore` and will **NOT** be committed to GitHub:

- `server/serviceAccountKey.json` - Firebase service account credentials
- `server/.env` - Environment variables and secrets
- `server/credentials/` - Any additional credential files
- `server/secrets/` - Secret files directory

### Template Files
The following template files are included for reference:
- `server/serviceAccountKey.example.json` - Shows the structure of Firebase credentials
- `server/env.example` - Shows required environment variables

### Best Practices
1. **Never commit credentials**: All sensitive files are protected by `.gitignore`
2. **Use environment variables**: Store secrets in `.env` files
3. **Rotate keys regularly**: Update your Firebase and Razorpay keys periodically
4. **Monitor access**: Regularly check who has access to your credentials

## 🚨 Important Notes

1. **Backup First**: Test the cleanup system in development before deploying to production
2. **Monitor Initially**: Watch the logs for the first few days to ensure proper operation
3. **Service Account Security**: Keep your service account key secure and never commit it to version control
4. **Storage Costs**: This will help reduce Firebase Storage costs by removing old files
5. **Credential Protection**: All sensitive files are now protected from accidental commits

## 🐛 Troubleshooting

### Common Issues

1. **Service Account Error**
   - Ensure `serviceAccountKey.json` is properly configured
   - Check that the service account has proper permissions

2. **Storage Permission Error**
   - Verify the service account has Storage Admin role
   - Check Firebase Storage rules

3. **Firestore Permission Error**
   - Ensure the service account has Firestore Admin role
   - Check Firestore security rules

### Debug Mode
Add more detailed logging by modifying the cleanup function:

```javascript
console.log('Processing document:', doc.id, 'with data:', data);
```

## 📞 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify Firebase permissions and configuration
3. Test with the manual cleanup endpoint first
4. Ensure all environment variables are set correctly

---

**Note**: This cleanup system will permanently delete data. Make sure you have proper backups and understand the implications before deploying to production.
