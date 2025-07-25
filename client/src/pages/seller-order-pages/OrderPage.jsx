import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageBacker from "../../components/PageBacker";
import { AnimatePresence, motion } from "framer-motion";
import { getSellerAllOrders } from "../../features/order/orderThunks";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Info, Truck, Ban, Pencil } from "lucide-react";
import Lottie from "lottie-react";
import AddToCartAnimationImg from "../../assets/empty.json";
import { format } from "date-fns";

function OrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getSellerAllOrders());
  }, [dispatch]);

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Sticky Header */}
      <header className="bg-white shadow-md pl-4 flex justify-between items-center h-14 w-full pr-5 sticky top-0 z-50">
        <PageBacker />
        <div className="flex items-center gap-4 relative">
          {/* Tooltip Info */}
          <div className="relative group cursor-pointer">
            <Info className="w-5 h-5 text-blue-700" />
            <div className="absolute right-0 top-full mt-2 w-64 p-2 text-sm rounded-lg shadow-lg bg-white text-gray-700 border border-gray-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50">
              <p className="font-medium text-blue-900 mb-1">Order Info</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Orders can be cancelled only if status is{" "}
                  <strong>Pending</strong>.
                </li>
                <li>Once shipped, cancellations are not allowed.</li>
                <li>Contact support for delivery issues.</li>
              </ul>
            </div>
          </div>
          <div className="h-5 w-0.5 bg-blue-400 rounded-full"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-800">📦 Seller Orders</h1>
        <AnimatePresence>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-4"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-900">
                      Order ID: {order.orderId}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Transaction: {order.transactionId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Placed:{" "}
                      {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full inline-block ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    <div className="text-sm font-medium text-blue-700">
                      {order.paymentMethod}
                    </div>
                    <p className="text-xl font-bold text-blue-800">
                      ₹ {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                  <p>
                    <strong>Name:</strong> {order.user.fullName}
                  </p>
                  <p>
                    <strong>Address:</strong> {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}
                  </p>
                  <p>
                    <strong>District:</strong> {order.shippingAddress.district},{" "}
                    <strong>Postal:</strong> {order.shippingAddress.postalCode}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.shippingAddress.phone}
                  </p>
                </div>

                {/* Product List */}
                <div className="space-y-3">
                  {order.products.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-50 border p-3 rounded-lg"
                    >
                      <div>
                        <h4 className="text-blue-900 font-semibold">
                          {item.product?.title || "Unnamed Product"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <span className="text-black font-medium">
                            {item.status}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-2 mt-2 md:mt-0 flex-wrap">
                        <button
                          onClick={() => toast.success("Marked as processed")}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Truck size={16} /> Process
                        </button>
                        <button
                          onClick={() => toast.error("Cancelled")}
                          className="flex items-center gap-1 border border-red-600 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-50"
                        >
                          <Ban size={16} /> Cancel
                        </button>
                        <button
                          onClick={() => toast("Change status action")}
                          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
                        >
                          <Pencil size={16} /> Change
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-10 w-full flex flex-col justify-start items-center gap-4"
            >
              <p>
                You have not received any orders yet.{" "}
                <span
                  onClick={() => navigate("/")}
                  className="underline text-blue-700 cursor-pointer"
                >
                  Back to Home
                </span>
              </p>
              <Lottie
                loop={true}
                animationData={AddToCartAnimationImg}
                className="w-80"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default OrderPage;
