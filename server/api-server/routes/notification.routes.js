import express from "express";
import {
  saveSubscription,
  triggerNotification,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/subscribe", verifyJWT, saveSubscription);
router.post("/trigger", triggerNotification);

export default router;
