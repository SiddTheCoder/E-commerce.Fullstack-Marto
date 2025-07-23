self.addEventListener("push", (event) => {
  console.log("[SW] Push event received:", event);
  let data = { title: "No Title", body: "No Body" };
  console.log("[SW] Push raw data:", event.data?.text());

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.error("❌ Failed to parse push event data", err);
  }

  console.log("[SW] Showing notification:", data);

  const options = {
    body: data.body,
    icon: "https://cdn-icons-png.flaticon.com/512/1828/1828911.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  console.log("[SW] Notification clicked");
  event.notification.close();

  const targetUrl = "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
