# 🔒 Credentials Setup Guide

This guide explains how to securely set up credentials for the College Printing Shop application.

## 🛡️ Security Overview

All sensitive files are protected by `.gitignore` and will **NOT** be committed to GitHub. This includes:
- Firebase service account keys
- Environment variables
- API keys and secrets
- Any credential files

## 📁 Protected Files

The following files and directories are protected:

```
server/
├── .env                          # Environment variables (PROTECTED)
├── serviceAccountKey.json        # Firebase credentials (PROTECTED)
├── credentials/                  # Credential directory (PROTECTED)
├── secrets/                      # Secrets directory (PROTECTED)
├── env.example                   # Environment template (PUBLIC)
└── serviceAccountKey.example.json # Firebase template (PUBLIC)
```

## 🔧 Setup Instructions

### Step 1: Firebase Service Account

1. **Download from Firebase Console**:
   - Go to https://console.firebase.google.com
   - Select your project (`printshop-10`)
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Save the file**:
   ```bash
   # Copy the downloaded file to the server directory
   cp ~/Downloads/your-project-firebase-adminsdk-xxxxx-abc123def456.json server/serviceAccountKey.json
   ```

### Step 2: Environment Variables

1. **Copy the template**:
   ```bash
   cp server/env.example server/.env
   ```

2. **Edit the file** with your actual values:
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

## 🔍 Verification

To verify your credentials are properly set up:

1. **Check file existence**:
   ```bash
   ls -la server/serviceAccountKey.json
   ls -la server/.env
   ```

2. **Test the cleanup service**:
   ```bash
   cd server
   npm run cleanup:setup
   ```

3. **Check .gitignore protection**:
   ```bash
   git status
   # The protected files should NOT appear in the output
   ```

## 🚨 Security Best Practices

### ✅ Do's
- Store credentials in protected files
- Use environment variables for configuration
- Rotate keys regularly
- Monitor access to credentials
- Use different keys for development and production

### ❌ Don'ts
- Never commit credentials to Git
- Don't share credentials in chat or email
- Don't use the same keys across projects
- Don't store credentials in public repositories
- Don't hardcode secrets in your code

## 🔄 Updating Credentials

When you need to update credentials:

1. **Firebase Service Account**:
   - Generate a new key in Firebase Console
   - Replace `server/serviceAccountKey.json`
   - Test the application

2. **Environment Variables**:
   - Update `server/.env`
   - Restart the server
   - Test the functionality

3. **Razorpay Keys**:
   - Update keys in Razorpay Dashboard
   - Update `server/.env`
   - Test payment functionality

## 🆘 Troubleshooting

### Common Issues

1. **"serviceAccountKey.json not found"**
   - Ensure the file exists in `server/` directory
   - Check file permissions
   - Verify the file name is exactly `serviceAccountKey.json`

2. **"Invalid PEM formatted message"**
   - Ensure you copied the entire JSON file
   - Check that the private key is properly formatted
   - Verify no extra characters were added

3. **Environment variables not loading**
   - Ensure `.env` file exists in `server/` directory
   - Check variable names match exactly
   - Restart the server after changes

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all required files exist
3. Ensure file permissions are correct
4. Test with the setup script: `npm run cleanup:setup`

## 📞 Support

For additional help:
- Check the main `CLEANUP_SETUP.md` guide
- Review Firebase documentation
- Contact your system administrator

---

**Remember**: Your credentials are now protected and will not be accidentally committed to version control! 🔒
