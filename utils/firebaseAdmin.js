import admin from "firebase-admin";
import FirebaseToken from "../models/FirebaseToken.js"; 

let serviceAccount = {};

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || "{}");
  
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (err) {
  console.error("❌ Invalid FIREBASE_CONFIG format:", err);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ✅ Send push that works in both foreground (data) & background (notification)

export const sendPushNotification = async (token, payload) => {
  try {
    const response = await admin.messaging().send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {}, // optional custom data
    });

    console.log("✅ Push notification sent:", response);
  } catch (err) {
    if (err.code === "messaging/registration-token-not-registered") {
      console.log(`🗑️ Removing invalid token: ${token}`);
      await FirebaseToken.deleteOne({ token });
    } else {
      console.error("❌ Error sending push notification:", err);
    }
  }
};


