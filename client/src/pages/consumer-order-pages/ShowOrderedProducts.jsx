import React, { useEffect } from "react";
import {
  Package,
  Loader,
  Truck,
  CheckCircle,
  Receipt,
  CalendarDays,
  Wallet,
  IndianRupee,
  XCircle,
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";

import { toast } from "react-hot-toast";
import { cancelOrderViaConsumer } from "../../features/order/orderThunks";

const statusSteps = [
  { label: "Pending", icon: Package },
  { label: "Processing", icon: Loader },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: CheckCircle },
];

const getStatusIndex = (status) =>
  statusSteps.findIndex((s) => s.label === status);

export default function ShowOrderedProducts({ orders }) {
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handleImageIndexChange = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 5);
  };

  useEffect(() => {
    const interval = setInterval(handleImageIndexChange, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleProductOrderCancel = async (orderId, productId) => {
    try {
      console.log("orderId", orderId, "productId", productId);
      await dispatch(cancelOrderViaConsumer({ orderId, productId })).unwrap();
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.log("Error occured while canceling order via consumer", error);
      toast.error(error.message);
    }
  };

  if (!orders?.length)
    return <p className="text-center text-gray-500">No orders found.</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-blue-100 p-6 rounded-2xl shadow-sm bg-white"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-blue-900 mb-4">
            <div className="flex items-center gap-2">
              <Receipt size={16} className="text-blue-500" />
              <span className="font-medium">Order ID:</span>
              <span className="truncate">{order.orderId}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-500" />
              <span className="font-medium">Date:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-blue-500" />
              <span className="font-medium">Payment:</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee size={16} className="text-blue-500" />
              <span className="font-medium">Total:</span>
              <span className="font-semibold">Rs. {order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          {order.products.map((prod, index) => {
            const currentStatusIndex = getStatusIndex(prod.status);

            return (
              <div
                key={index}
                className="border-t pt-4 mt-4 group relative transition"
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={
                      prod.product?.images[currentImageIndex] ||
                      "/placeholder.png"
                    }
                    alt={prod.product?.title || "Product"}
                    className="w-16 h-16 object-cover rounded border border-blue-100"
                  />
                  <div className="text-sm text-gray-800">
                    <p className="font-semibold">
                      {prod.product?.title || "Product"}
                    </p>
                    <p>Qty: {prod.quantity}</p>
                    <p>
                      Status:{" "}
                      <span className="capitalize text-blue-600 font-medium">
                        {prod.status}
                      </span>
                    </p>
                  </div>

                  {/* Cancel Button (Only if Pending and on hover) */}
                  {prod.status === "Pending" && (
                    <button
                      onClick={() =>
                        handleProductOrderCancel(order._id, prod.product._id)
                      }
                      className="absolute top-2 right-2 hidden group-hover:inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 transition shadow"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                </div>

                {/* Tracker */}
                <div className="flex items-center justify-between relative mt-6">
                  {statusSteps.map((step, i) => {
                    const Icon = step.icon;
                    const isDone = i <= currentStatusIndex;
                    const isActive = i === currentStatusIndex;

                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center text-xs text-center z-10"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 
                            ${
                              isDone
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-blue-200 text-blue-300 bg-white"
                            }`}
                        >
                          <Icon size={14} />
                        </div>
                        <span
                          className={`mt-1 text-[10px] ${
                            isActive
                              ? "text-blue-700 font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}

                  {/* Connector Lines */}
                  <div className="absolute top-3 left-0 w-full h-0.5 bg-blue-100 z-0" />
                  <div
                    className="absolute top-3 left-0 h-0.5 bg-blue-500 z-0 transition-all rounded-full"
                    style={{ width: `${(currentStatusIndex / 3) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
