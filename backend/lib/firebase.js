import admin from "firebase-admin";

// Parse and fix private key formatting
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIAL);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Admin initialized successfully!");

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
