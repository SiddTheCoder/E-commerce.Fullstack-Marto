import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Store } from "../../shared/models/store.model.js";
import { Order } from "../../shared/models/order.model.js";
import { v4 as uuidv4 } from "uuid";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../../shared/models/user.model.js";
import dayjs from "dayjs";
import sendMail from "../utils/sendMail.js";
import { Product } from "../../shared/models/product.model.js";

export const getDashboardOrderedProducts = asyncHandler(async (req, res) => {
  // format data structure
  // const orders = [
  //   {
  //     title: "Water Bottle",
  //     store: "Peterson Jack",
  //     customer: "Peterson Jack",
  //     orderId: "#8441573",
  //     date: "27 Jun 2025",
  //     status: "Pending",
  //     statusColor: "text-yellow-600 bg-yellow-100",
  //   },
  // ];

  const orders = await Order.find({ "products.seller": req.user._id })
    .sort({ createdAt: -1 }) // Order-level sort
    .populate({
      path: "products.product",
      populate: [
        {
          path: "store",
        },
      ],
    })
    .populate({
      path: "user",
      select: "fullName",
    });

  console.log(orders);

  const formattedOrdersWithProducts = orders.map((order) => {
    const products = order.products.map((item) => {
      let statusColor;
      if (item.status === "Pending") {
        statusColor = "text-yellow-600 bg-yellow-100";
      } else if (item.status === "Shipped") {
        statusColor = "text-green-600 bg-green-100";
      } else if (item.status === "Canceled") {
        statusColor = "text-red-600 bg-red-100";
      } else {
        statusColor = "text-blue-600 bg-blue-100";
      }

      return {
        title: item.product.title,
        quantity: item.quantity,
        status: item.status,
        date: dayjs(item.orderPlacedAt).format("DD-MM-YYYY"),
        statusColor: statusColor,
        store: item.product.store.storeName,
      };
    });

    return {
      products,
      customer: order.user.fullName,
      orderId: order.orderId,
    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formattedOrdersWithProducts,
        "Orders fetched successfully"
      )
    );
});

