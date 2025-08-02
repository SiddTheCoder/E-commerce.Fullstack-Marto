import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import FlyingManImg from "../../assets/Man-flying.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Images
import BecomeSeller from "../../assets/ads-images/become-seller.png";
import WishListProducts from "../../assets/ads-images/wishlist-products.png";
import Dashboard2 from "../../assets/ads-images/dashboard2.png";
import Dashboard1 from "../../assets/ads-images/dashboard1.png";
import OrderReview from "../../assets/ads-images/order-reveiw.png";
import CartProducts from "../../assets/ads-images/cart-products.png";
import Store from "../../assets/ads-images/store.png";

const advertisementImages = [
  BecomeSeller,
  WishListProducts,
  Dashboard2,
  Dashboard1,
  OrderReview,
  CartProducts,
  Store,
];

function AdvertiseApp({ onClose }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === advertisementImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Dot click handler
  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="cursor-auto fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 text-black px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.1, y: 200, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 10 }}
          className="bg-white rounded-xl shadow-xl pb-3 w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[60vw] h-[85vh] sm:h-[70vh] overflow-hidden flex flex-col relative"
        >
          {/* Close Button */}
          <div className="w-full flex justify-end absolute top-2 right-2">
            <X onClick={onClose} className="cursor-pointer" />
          </div>

          {/* Congrats Text */}
          <div className="flex h-auto text-sm sm:text-base md:text-lg w-full text-center rounded-md px-2 py-2 text-black">
            <span className="w-full flex items-center justify-center flex-wrap">
              <span onClick={() => navigate("/login")} className="hover:underline px-1 hover:cursor-pointer hover:text-blue-600 font-semibold">Login</span> to get all the features of
              <span className="highlight-tilt px-2 mx-1 text-white">
                Anbari!
              </span>{" "}
              🎉
            </span>
          </div>

          {/* Image Slider */}
          <div className="relative w-full flex-1 mt-4 flex flex-col items-center">
            <div className="relative w-full  h-[200px] sm:h-full md:h-full overflow-hidden rounded-xl shadow-md">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={advertisementImages[currentIndex]}
                  alt="advertisement"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-0 left-0 w-full h-full object-contain"
                />
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-4">
              {advertisementImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-blue-600 scale-110"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AdvertiseApp;
