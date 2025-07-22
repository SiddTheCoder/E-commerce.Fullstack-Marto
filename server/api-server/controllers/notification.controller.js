import { Subscription } from "../../shared/models/subscription.model.js";
import webPush from "../utils/webPush.js";

export const saveSubscription = async (req, res) => {
  const { subscription } = req.body;
  const userId = req.user._id; // from verifyJWT

  await Subscription.findOneAndUpdate(
    { user: userId },
    { subscription },
    { upsert: true, new: true }
  );
  console.log("Subscription saved", subscription);
  res.status(201).json({ message: "Subscription saved" });
};

export const triggerNotification = async (req, res) => {
  const subs = await Subscription.find();

  const payload = JSON.stringify({
    title: "New Order",
    body: "A new order has been placed!",
  });

  for (const sub of subs) {
    try {
      await webPush.sendNotification(sub.subscription, payload);
    } catch (err) {
      console.error("Push error", err);
    }
  }

  res.status(200).json({ message: "Notifications sent" });
};
