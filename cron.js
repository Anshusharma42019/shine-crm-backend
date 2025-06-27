import { runReminderForAllLeads } from "./utils/reminderLogic.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Method Not Allowed");

  try {
    await runReminderForAllLeads();
    return res.status(200).json({ message: "Reminder cron executed successfully" });
  } catch (err) {
    console.error("❌ Cron error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
