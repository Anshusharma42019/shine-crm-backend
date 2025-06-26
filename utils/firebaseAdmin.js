// firebaseAdmin.js

import admin from "firebase-admin";
import FirebaseToken from "../models/FirebaseToken.js";

// 🔐 Load Firebase Service Account from environment variable
let serviceAccount = {};

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || "{}");

  // Fix newline escape characters in private key
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (err) {
  console.error("❌ Invalid FIREBASE_CONFIG format:", err);
}

// 🚀 Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized with Hotel Buddha credentials");
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin:", err.message);
  }
}

// 📲 Push Notification Sender
export const sendPushNotification = async (token, payload) => {
  try {
    const response = await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {}, // Optional additional data
    });

    console.log("✅ Push notification sent:", response);
  } catch (err) {
    // 🗑️ Remove token if it's invalid
    if (err.code === "messaging/registration-token-not-registered") {
      console.warn(`🗑️ Removing invalid FCM token: ${token}`);
      await FirebaseToken.deleteOne({ token });
    } else {
      console.error("❌ Error sending push notification:", err);
    }
  }
};
