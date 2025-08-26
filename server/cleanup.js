const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch (error) {
  console.error('❌ Error: serviceAccountKey.json not found or invalid!');
  console.error('Please ensure you have downloaded your Firebase service account key and saved it as serviceAccountKey.json');
  console.error('See CLEANUP_SETUP.md for detailed instructions');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "printshop-10.firebasestorage.app"
});

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

const app = express();
app.use(express.json());
app.use(cors());

// Cleanup function to delete old print requests and PDFs
async function cleanupOldRequests() {
  try {
    console.log('Starting cleanup process...');
    
    // Calculate timestamp for 24 hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    console.log(`Deleting requests older than: ${oneDayAgo.toISOString()}`);
    
    // Query for documents older than 24 hours
    const snapshot = await db.collection('printRequests')
      .where('createdAt', '<', admin.firestore.Timestamp.fromDate(oneDayAgo))
      .get();
    
    console.log(`Found ${snapshot.size} documents to delete`);
    
    let deletedCount = 0;
    let storageDeletedCount = 0;
    
    // Process each document
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      try {
        // Delete PDF from storage if it exists
        if (data.pdfUrl) {
          try {
            // Extract file path from URL
            const urlParts = data.pdfUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const filePath = `pdfs/${fileName}`;
            
            console.log(`Deleting storage file: ${filePath}`);
            
            // Delete file from storage
            await bucket.file(filePath).delete();
            storageDeletedCount++;
            console.log(`Successfully deleted storage file: ${filePath}`);
          } catch (storageError) {
            console.log(`Storage file not found or already deleted: ${data.pdfUrl}`);
          }
        }
        
        // Delete Firestore document
        await doc.ref.delete();
        deletedCount++;
        console.log(`Deleted document: ${doc.id}`);
        
      } catch (error) {
        console.error(`Error deleting document ${doc.id}:`, error);
      }
    }
    
    console.log(`Cleanup completed!`);
    console.log(`- Firestore documents deleted: ${deletedCount}`);
    console.log(`- Storage files deleted: ${storageDeletedCount}`);
    
    return {
      success: true,
      firestoreDeleted: deletedCount,
      storageDeleted: storageDeletedCount,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error during cleanup:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Manual cleanup endpoint
app.post('/api/cleanup', async (req, res) => {
  try {
    const result = await cleanupOldRequests();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get cleanup statistics
app.get('/api/cleanup/stats', async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    const snapshot = await db.collection('printRequests')
      .where('createdAt', '<', admin.firestore.Timestamp.fromDate(oneDayAgo))
      .get();
    
    res.json({
      success: true,
      oldRequestsCount: snapshot.size,
      cutoffTime: oneDayAgo.toISOString(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cleanup service is running',
    timestamp: new Date().toISOString()
  });
});

// Schedule cleanup to run every 6 hours
const CLEANUP_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

function scheduleCleanup() {
  console.log('Scheduling automatic cleanup every 6 hours...');
  
  // Run cleanup immediately on startup
  cleanupOldRequests();
  
  // Schedule recurring cleanup
  setInterval(async () => {
    console.log('Running scheduled cleanup...');
    await cleanupOldRequests();
  }, CLEANUP_INTERVAL);
}

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Cleanup service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Manual cleanup: POST http://localhost:${PORT}/api/cleanup`);
  console.log(`Cleanup stats: GET http://localhost:${PORT}/api/cleanup/stats`);
  
  // Start scheduled cleanup
  scheduleCleanup();
});

module.exports = { cleanupOldRequests };
