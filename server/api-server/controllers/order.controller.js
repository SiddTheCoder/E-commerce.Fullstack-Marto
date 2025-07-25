import { Product } from "../../shared/models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Store } from "../../shared/models/store.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../../shared/models/user.model.js";
import { Order } from "../../shared/models/order.model.js";
import { Cart } from "../../shared/models/cart.model.js";
import { Transaction } from "../../shared/models/transaction.model.js";
import { Subscription } from "../../shared/models/subscription.model.js";
import { v4 as uuidv4 } from "uuid";
import { sendPushNotification } from "../utils/webPush.js";

// interface ProductData {
//   productId: string;
//   sellerId: string;
//   quantity: number;
// }

// interface BODY__FOR__PLACE__ORDER {
//   productData: ProductData[];
//   paymentMethod: string;
//   totalAmount: number;
//   fromCart: Boolean;
// }

export const placeOrder = asyncHandler(async (req, res) => {
  // productData shoul be an array of product objects [{ productId, quantity }]
  const {
    productData,
    totalAmount,
    shippingAddress,
    paymentMethod,
    fromCart = false,
  } = req.body;

  console.log("req.body", req.body);

  if (!productData || productData.length === 0) {
    throw new ApiError(400, "No product data provided");
  }

  if (!totalAmount || totalAmount <= 0) {
    throw new ApiError(400, "Total amount must be greater than 0");
  }

  // If no shippingAddress sent, fallback to user's saved info
  const userAddress = shippingAddress || {
    fullName: req.user.name,
    phone: req.user.phoneNumber,
    address: req.user.address,
    city: req.user.city,
    postalCode: req.user.postalCode,
    district: req.user.district,
  };

  // Prepare order products array in correct schema structure
  const formattedProducts = productData.map((item) => ({
    product: item.productId,
    seller: item.sellerId,
    quantity: item.quantity || 1,
    isDelivered: false,
    seenBySeller: false,
    orderPlacedAt: new Date(),
  }));

  // Create a new order
  const newOrder = await Order.create({
    user: req.user._id,
    products: formattedProducts,
    totalAmount,
    shippingAddress: userAddress,
    paymentMethod,
    orderId: uuidv4(),
    transactionId: uuidv4(),
  });

  // After creating the Order
  const newTransaction = await Transaction.create({
    transactionId: newOrder.transactionId,
    order: newOrder._id,
    user: req.user._id,
    paymentMethod,
    amount: totalAmount,
    status: paymentMethod === "COD" ? "Success" : "Pending",
    paidAt: paymentMethod === "COD" ? new Date() : null,
  });

  // Optionally clean up the cart if coming from cart
  if (fromCart) {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter((item) => {
        return !productData.some(
          (p) => p.productId.toString() === item.product.toString()
        );
      });
      await cart.save();
    }
  }

  // for backend check
  console.log("New Order:", newOrder);
  console.log("New Transaction:", newTransaction);

  // send push notification to Buyer and seller
  let buyerNotification, sellerNotifications;

  // send push notification to buyer
  const subscriptionOfBuyer = await Subscription.findOne({
    user: req.user._id,
  });
  if (subscriptionOfBuyer) {
    const subscription = subscriptionOfBuyer.subscription;

    const payload = {
      title: "📦 Order Placed",
      body: `You just placed a new order .`,
    };

    buyerNotification = await sendPushNotification(
      subscription,
      JSON.stringify(payload)
    );
  }

  // send push notification to seller
  const sellersId = productData.map((item) => item.sellerId);

  const subscriptionsOfSellers = await Subscription.find({
    user: { $in: sellersId },
  });

  for (const sellerId of sellersId) {
    const sellerSub = subscriptionsOfSellers.find(
      (sub) => sub.user.toString() === sellerId.toString()
    );

    if (sellerSub) {
      const sellerProducts = productData.filter((p) => p.sellerId === sellerId);
      const productNames = sellerProducts
        .map((p) => p?.title || "a product")
        .join(", ");

      const payload = {
        title: "📦 New Order!",
        body: `You just got an order for ${productNames}`,
      };

      sellerNotifications = await sendPushNotification(
        sellerSub.subscription,
        JSON.stringify(payload)
      );
    }
  }

  // backend check
  console.log(
    "Buyer Notification:",
    buyerNotification,
    "Seller  Notification:",
    sellerNotifications
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { order: newOrder }, "Order placed successfully")
    );
});

export const getConsumerAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 }) // Order-level sort
    .populate("products.product")
    .populate("products.seller");

  // Now sort the `products` array inside each order
  const sortedOrders = orders.map((order) => {
    const sortedProducts = [...order.products].sort(
      (a, b) => new Date(b.orderPlacedAt) - new Date(a.orderPlacedAt)
    );
    return {
      ...order._doc, // flatten Mongoose doc
      products: sortedProducts,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, sortedOrders, "Orders fetched successfully"));
});

export const getSellerAllOrders = asyncHandler(async (req, res) => {
  // find all orders on the basis of store and place them together (for dashboard,etc)
  const orders = await Order.find({ "products.seller": req.user._id })
    .sort({ createdAt: -1 }) // Order-level sort
    .populate("products.product")
    .populate({
      path: "user",
      select: "fullName",
    });

  console.log("orders", orders);
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const getOrderById = asyncHandler(async (req, res) => {});

export const cancelOrder = asyncHandler(async (req, res) => {});

export const returnOrder = asyncHandler(async (req, res) => {});

export const refundOrder = asyncHandler(async (req, res) => {});
