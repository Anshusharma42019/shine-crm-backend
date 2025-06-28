import connectDB from "../config/db.js";
import { runReminderForAllLeads } from "../utils/reminderLogic.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  try {
    console.log("🔁 Cron triggered");
    await connectDB(); 
    await runReminderForAllLeads();
    return res.status(200).json({ message: "Reminder cron executed" });
  } catch (error) {
    console.error("❌ Cron error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
