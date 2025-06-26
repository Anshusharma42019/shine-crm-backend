import admin from "firebase-admin";

let serviceAccount = {};

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || "{}");
  console.log(serviceAccount);
  
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
export const sendPushNotification = async (token, title, body) => {
  const message = {
    notification: { title, body }, // for background via service worker
    data: { title, body },         // for foreground in web app
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
