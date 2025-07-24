import { Router } from "express";
import {
  authorizeRoles,
  verifyJWT,
} from "../middlewares/authorize.middleware.js";

import {
  placeOrder,
  getConsumerAllOrders,
  getSellerAllOrders,
  getOrderById,
  cancelOrder,
  returnOrder,
  refundOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/place-order").post(verifyJWT, placeOrder);

router
  .route("/get-consumer-all-orders")
  .get(verifyJWT, authorizeRoles("consumer", "seller"), getConsumerAllOrders);
router
  .route("/get-seller-all-orders")
  .get(verifyJWT, authorizeRoles("seller"), getSellerAllOrders);

router
  .route("/get-order-by-id")
  .get(verifyJWT, authorizeRoles("consumer"), getOrderById);
router
  .route("/cancel-order")
  .post(verifyJWT, authorizeRoles("consumer"), cancelOrder);
router
  .route("/return-order")
  .post(verifyJWT, authorizeRoles("consumer"), returnOrder);
router
  .route("/refund-order")
  .post(verifyJWT, authorizeRoles("consumer"), refundOrder);

export default router;
