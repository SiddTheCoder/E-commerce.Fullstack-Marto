import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

// import routes
import cartRoutes from "./routes/cart.routes.js";
import userRoutes from "./routes/user.routes.js";
import { verifyJWT } from "./middlewares/authorize.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import productRoutes from "./routes/product.routes.js";
import dropshippingRoutes from "./routes/dropshipping.routes.js";
import orderRoutes from "./routes/order.routes.js";
// import webPush from "web-push";
import notificationRoutes from "./routes/notification.routes.js";


// use routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/store", storeRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/dropshipping", dropshippingRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/notification", notificationRoutes);

// check the server - runtime
app.get("/ping", (req, res) => {
  res.json({
    message: "OK",
    uptime: process.uptime(), // in seconds
    timestamp: new Date(),
  });
});

// check server
app.get("/", (req, res) => {

  // const vapidKeys = webPush.generateVAPIDKeys();
  // console.log(vapidKeys);
  res.send("Rest API working : Hello World");
});

export default app;
