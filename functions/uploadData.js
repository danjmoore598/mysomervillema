const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');

// Initialize Firebase admin
const serviceAccount = require('/Users/Dan/Projects/Credentials/mysomervillema-firebase-adminsdk-z765n-54af4951f2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const uploadData = async (filePath) => {
  const readStream = fs.createReadStream(filePath);
  readStream
    .pipe(csv())
    .on('data', async (row) => {
      // Convert data to appropriate types if needed (e.g., numbers, boolean)
      // Here, I assume everything remains a string for simplicity

      // Add each row to the Firestore database
      await db.collection('addresses').add(row);
      console.log(`Added record with Street Name: ${row["Street Name"]}`);
    })
    .on('end', () => {
      console.log('CSV file processed.');
    });
};

uploadData('/Users/Dan/Desktop/Somerville Ward and Precinct Data.csv'); // Your file path
