import { Product } from "../../shared/models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Store } from "../../shared/models/store.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../../shared/models/user.model.js";
import { Order } from "../../shared/models/order.model.js";

export const placeOrder = asyncHandler(async (req, res) => { 
  // productData shoul be an array of product objects [{ productId, quantity }]


  const { productData, totalAmount, shippingAddress, paymentMethod } = req.body;

  if (!productData || productData.length === 0) {
    throw new ApiError(400, "No product data provided");
  }

  if (totalAmount <= 0) {
    throw new ApiError(400, "Total amount must be greater than 0");
  }

  let userAddress = shippingAddress;
  if (!shippingAddress) {
    userAddress = {
      fullName: req.user.name,
      phone: req.user.phoneNumber,
      address: req.user.address,
      city: req.user.address,
      postalCode: req.user.postalCode,
      district: req.user.district,
    }
  }

  const order = await Order.findOne({ user: req.user._id });

  if (order) {
    order.products.push(...productData);
    order.totalAmount = totalAmount;
    order.shippingAddress = userAddress;
    order.paymentMethod = paymentMethod;
    order.status = "pending";
    await order.save();
  } else {
    const newOrder = await Order.create({
      user: req.user._id,
      products: productData,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "pending",
    });
    await newOrder.save();
  }


  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order placed successfully"));

});

export const getConsumerAllOrders = asyncHandler(async (req, res) => { });

export const getSellerAllOrders = asyncHandler(async (req, res) => {
  // find all orders on the basis of store and place them together (for dashboard,etc)
});

export const getOrderById = asyncHandler(async (req, res) => { });

export const cancelOrder = asyncHandler(async (req, res) => { });

export const returnOrder = asyncHandler(async (req, res) => { });

export const refundOrder = asyncHandler(async (req, res) => { });