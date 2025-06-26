import cron from "node-cron";
import dotenv from "dotenv";
import Lead from "../models/Lead.js";
import FirebaseToken from "../models/FirebaseToken.js";
import { sendPushNotification } from "../utils/firebaseAdmin.js";

dotenv.config();

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

// 🧠 Move all logic into a reusable function
const runReminderLogic = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  try {
    const leads = await Lead.find({
      meetingDate: {
        $gte: today,
        $lt: new Date(dayAfter.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    const tokens = await FirebaseToken.find();

    console.log(`📅 Matched leads: ${leads.length} | 📲 Tokens: ${tokens.length}`);

    for (const lead of leads) {
      const meetingDate = new Date(lead.meetingDate);
      let message = "";

      if (isSameDay(meetingDate, dayAfter)) {
        message = `📅 Meeting with ${lead.name} in 2 days.`;
      } else if (isSameDay(meetingDate, tomorrow)) {
        message = `📆 Meeting with ${lead.name} tomorrow.`;
      } else if (isSameDay(meetingDate, today)) {
        message = `📍 Meeting with ${lead.name} today.`;
      }

      if (message) {
        for (const { token } of tokens) {
          try {
            await sendPushNotification(token, {
              title: "CRM Reminder",
              body: message,
              data: {
                leadId: lead._id.toString(),
                name: lead.name,
              },
            });
            console.log("✅ Sent to token:", token);
          } catch (err) {
            console.error("❌ Failed to send to token:", token, err.message);
          }
        }
      }
    }
  } catch (err) {
    console.error("❌ Error in reminder logic:", err.message);
  }
};

// 🕐 Cron job scheduled at 14:51 IST daily
cron.schedule("12 15 * * *", async () => {
  console.log("⏰ Cron running at:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
  try {
    await runReminderLogic();
  } catch (err) {
    console.error("❌ Cron execution error:", err.message);
  }
}, {
  timezone: "Asia/Kolkata",
});

