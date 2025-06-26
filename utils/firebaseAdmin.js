import admin from "firebase-admin";
import serviceAccount from JSON.parse(process.env.FIREBASE_CONFIG)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const sendPushNotification = async (token, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Push notification sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending push:", error);
    throw error;
  }
};
