import webPush from "web-push";
import dotenv from "dotenv";
dotenv.config();

webPush.setVapidDetails(
  "mailto:your@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default webPush;

// To send notification
export const sendPushNotification = (subscription, payload) => {
  const formattedPayload = typeof payload === "string" ? payload : JSON.stringify(payload);
  return webPush.sendNotification(subscription, formattedPayload);


  // For future ))))
  // webPush
  //   .sendNotification(subscription, JSON.stringify(payload))
  //   .catch((error) => {
  //     if (error.statusCode === 410 || error.statusCode === 404) {
  //       // Subscription is no longer valid, remove from DB
  //     } else {
  //       console.error("Push notification error:", error);
  //     }
  //   });
};

// To send notification to all users
export const sendPushNotificationToAll = (subscriptions, payload) => {
  return Promise.all(
    subscriptions.map((subscription) =>
      sendPushNotification(subscription, payload)
    )
  );
};


// import { sendPushNotification } from "./utils/pushNotification.js"; // Your existing function
// import { Seller } from "./models/Seller.js"; // Or however you store the subscription

// app.post("/api/order-placed", async (req, res) => {
//   const { sellerId, orderDetails } = req.body;

//   try {
//     const seller = await Seller.findById(sellerId);

//     if (!seller || !seller.subscription) {
//       return res.status(404).json({ message: "Seller subscription not found" });
//     }

//     const payload = {
//       title: "📦 New Order!",
//       body: `You just got a new order for ${orderDetails.productName}`,
//     };

//     await sendPushNotification(seller.subscription, payload);

//     res.status(200).json({ message: "Notification sent" });
//   } catch (error) {
//     console.error("Push error:", error);
//     res.status(500).json({ message: "Failed to send notification" });
//   }
// });


// Todos
// 1. To send notification to all users
// 2. To send notification to specific user
// 3. To send notification to specific users