import axiosInstance from "./axiosInstance";

export const subscribeUserToPush = async () => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

      if (!vapidKey) {
        console.error(
          "❌ VAPID key not found. Make sure VITE_VAPID_PUBLIC_KEY is defined in your .env file."
        );
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await axiosInstance.post("/notification/subscribe", {
        subscription,
      });

      console.log("✅ User subscribed to push notifications", subscription);
    } catch (error) {
      console.error("❌ Failed to subscribe to push:", error);
    }
  }
};

// Helper function
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
