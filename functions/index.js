const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// ✅ Exported function: sendPushNotification
exports.sendPushNotification = functions.https.onRequest(async (req, res) => {
  const { token, title, body, data } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const message = {
    token,
    notification: {
      title,
      body,
    },
    data: data || {}, // Optional custom data
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Push notification sent:", response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    res.status(500).json({ error: error.message });
  }
});
