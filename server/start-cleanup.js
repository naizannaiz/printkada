#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Cleanup Service Setup...\n');

// Check if serviceAccountKey.json exists
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.log('❌ Error: serviceAccountKey.json not found!');
  console.log('\n📋 Please follow these steps:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com');
  console.log('2. Select your project (printshop-10)');
  console.log('3. Go to Project Settings > Service Accounts');
  console.log('4. Click "Generate new private key"');
  console.log('5. Download the JSON file');
  console.log('6. Save it as "serviceAccountKey.json" in the server directory');
  console.log('\n📖 See CLEANUP_SETUP.md for detailed instructions\n');
  process.exit(1);
}

// Check if the service account key is properly configured
try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  if (!serviceAccount.private_key || serviceAccount.private_key.includes('YOUR_PRIVATE_KEY')) {
    console.log('❌ Error: serviceAccountKey.json contains placeholder values!');
    console.log('Please replace the placeholder values with your actual Firebase service account credentials.\n');
    process.exit(1);
  }
  console.log('✅ Service account key configured');
} catch (error) {
  console.log('❌ Error: Invalid serviceAccountKey.json format');
  console.log('Please ensure the file contains valid JSON with your Firebase credentials.\n');
  process.exit(1);
}

// Install dependencies if needed
console.log('📦 Checking dependencies...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json found');
} else {
  console.log('❌ package.json not found in server directory');
  process.exit(1);
}

// Start the cleanup service
console.log('\n🚀 Starting cleanup service...\n');

const cleanupProcess = spawn('node', ['cleanup.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

cleanupProcess.on('error', (error) => {
  console.log('❌ Failed to start cleanup service:', error.message);
  console.log('\n💡 Try running: npm install && node cleanup.js');
});

cleanupProcess.on('close', (code) => {
  console.log(`\n🛑 Cleanup service stopped with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping cleanup service...');
  cleanupProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping cleanup service...');
  cleanupProcess.kill('SIGTERM');
  process.exit(0);
});
