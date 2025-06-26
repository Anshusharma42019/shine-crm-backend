import admin from "firebase-admin";

// ✅ Parse FIREBASE_CONFIG only if defined
let serviceAccount = {};
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || "{}");
} catch (err) {
  console.error("❌ Invalid FIREBASE_CONFIG format:", err);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const sendPushNotification = async (token, title, body) => {
  const message = {
    notification: { title, body },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Push notification sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
    throw error;
  }
};
