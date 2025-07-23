import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartProducts } from "../features/cart/cartThunks";
import PageBacker from "../components/PageBacker";
import CartItem from "../components/CartItem";
import { AnimatePresence, motion } from "framer-motion";
import { Omega } from "lucide-react"; // Assuming Omega is an icon you want to use
import { getConsumerAllOrders } from "../features/order/orderThunks";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import AddToCartAnimationImg from "../assets/empty.json";
import Lottie from "lottie-react";

function ProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getConsumerAllOrders());
  }, [dispatch]);

  console.log("Orders", orders);

  return (
    <div className="h-full w-full flex flex-col bg-slate-100/10">
      {/* Sticky Header */}
      <header className="bg-slate-100/10 shadow-md pl-4 flex justify-between items-center h-14 w-full pr-5 py-4 sticky top-0 z-50">
        <PageBacker />

        <div className="flex justify-center items-center gap-4">
          {/* Divider */}
          <div className="h-5 w-0.5 bg-blue-400 rounded-full"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-5 py-3 z-10 relative">
        {" "}
        {/* pt-20 to give space below fixed header */}
        <h1 className="text-2xl font-bold mb-6 text-blue-900">
          Your Ordered Products
        </h1>
        <AnimatePresence>
          {orders.products?.length > 0 ? (
            [...orders.products]
              .reverse()
              .map((item) => <span> Product Founds </span>)
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-10 w-full h-[70vh] flex flex-col justify-start items-center gap-4"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 mt-10"
              >
                You have not ordered any products yet .{" "}
                <span
                  onClick={() => navigate("/")}
                  className="highlight-tilt text-black px-4 py-1 cursor-pointer"
                >
                  Order Now !
                </span>
              </motion.p>
              <Lottie loop={true} animationData={AddToCartAnimationImg} className="w-96" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default ProductPage;
