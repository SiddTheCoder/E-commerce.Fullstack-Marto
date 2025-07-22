import webPush from "web-push";
import dotenv from "dotenv";
dotenv.config();

webPush.setVapidDetails(
  "mailto:your@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default webPush;

export const sendPushNotification = (subscription, payload) => {
  return webPush.sendNotification(subscription, JSON.stringify(payload));
};

// To send notification to all users
export const sendPushNotificationToAll = (subscriptions, payload) => {
  return Promise.all(
    subscriptions.map((subscription) =>
      sendPushNotification(subscription, payload)
    )
  );
};
