// components/CartItem.jsx
import React from "react";
import { motion } from "framer-motion";
import { X } from 'lucide-react'
import { useDispatch } from "react-redux";
import { toggleProductToCart } from "../features/cart/cartThunks";
import { toast } from "react-hot-toast";


const CartItem = ({ item }) => {

  const dispatch = useDispatch();

  const handleRemoveItemFromCart = async(productId) => {
    try {
      await dispatch(toggleProductToCart({productId})).unwrap()
    } catch (error) {
      toast.error('Unable to toggle')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="bg-black/5 rounded-xl shadow-md p-4 mb-4 w-full max-w-7xl py-5 mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-0"
    >
      {/* Left: Product Image */}
      <img
        src={item.product.images[0]}
        alt="Product"
        className="w-36 h-36 object-cover rounded-md border"
      />

      {/* Middle: Product Details */}
      <div className="flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-blue-800">
          {item.product.title}
        </h2>
        <p className="text-sm text-gray-600 mt-1">{item.product.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {item.product.features?.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Stock: <span className="text-green-600">{item.product.stock}</span>
        </p>
      </div>

      {/* Right: Quantity, Price, Actions */}
      <div className="flex flex-col items-center sm:items-end justify-between h-full gap-20 min-w-[90px]">
        <button
          onClick={() => handleRemoveItemFromCart(item.product._id)}
          className="flex gap-1 items-center bg-red-100 text-red-600 text-xs py-1 px-2 cursor-pointer rounded-md hover:bg-red-200"
        >
          <X width={14} />
        </button>

        <div className="flex items-center gap-2 px-2 py-1">
          <div className="border p-1 rounded border-black/20">
            <button className="text-blue-600 font-bold px-2 cursor-pointer hover:scale-150 transition-all duration-100 ease-in">
              -
            </button>
            <span className="px-2">{item.quantity}</span>
            <button className="text-blue-600 font-bold px-2 cursor-pointer hover:scale-150 transition-all duration-100 ease-in">
              +
            </button>
          </div>
          <p className="text-blue-800 font-bold text-lg">
            Rs {item.product.price}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
