// components/CartItem.jsx
import React from "react";
import { motion } from "framer-motion";
import { X } from 'lucide-react'
import { useDispatch } from "react-redux";
import { toggleProductToCart , updateCartProductCount} from "../features/cart/cartThunks";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";


const CartItem = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleProductCount = async (item, number) => {
    console.log("number testing", number)
  
    console.log("Number Passed", number)
    const count = item.quantity + number

    if(count <= 0) return

    try {
      await dispatch(updateCartProductCount({ productId: item.product._id, number: count })).unwrap()
    } catch (error) {
      toast.error('Unable to toggle')
    }
  };

  const increaseProductCount = (item) => handleProductCount(item, 1)
  const decreaseProductCount = (item) => handleProductCount(item, -1)

  const handleRemoveItemFromCart = async(productId) => {
    try {
      await dispatch(toggleProductToCart({productId})).unwrap()
    } catch (error) {
      toast.error('Unable to toggle')
    }
  }

  const handleOpenProductShowCase = (product) => {
    navigate(`/product/${product._id}`, {
      state: {
        backgroundLocation: location,
      },
    });
  };

  return (
    <motion.div
      key={item._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="bg-black/5 rounded-xl shadow-md p-2 mb-4 w-full max-w-7xl sm:py-5 mx-auto flex flex-row sm:items-start justify-between gap-4 sm:gap-6 relative z-0 sm:h-auto h-32"
    >
      {/* Left: Product Image */}
      <div className="flex flex-col items-start h-full">
        <img
          src={item.product.images[0]}
          alt="Product"
          className="sm:w-36 w-24 sm:h-36 h-24 object-cover rounded-md border"
        />
        <h2 className="text-base text-[12px] sm:hidden font-semibold text-blue-800 w-[95%] truncate">
          {item.product.title}
        </h2>
      </div>

      {/* Middle: Product Details */}
      <div  onClick={() => handleOpenProductShowCase(item.product)} className="flex-1 hidden sm:block cursor-pointer">
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
        <p className="text-sm text-gray-500 mt-2">
          <span onClick={() => handleOpenProductShowCase(item.product)} className="text-blue-600 hover:underline cursor-pointer">More Deatils</span>
        </p>
      </div>

      {/* Right: Quantity, Price, Actions */}
      <div className="flex flex-col items-center sm:items-end justify-end sm:h-full sm:gap-20 min-w-[90px] relative">
        <button
          onClick={() => handleRemoveItemFromCart(item.product._id)}
          className="absolute top-2 right-2 sm:relative flex gap-1 items-center bg-red-100 text-red-600 text-xs py-1 px-2 cursor-pointer rounded-md hover:bg-red-200"
        >
          <X width={14} />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2 px-2 py-1">
          <div className="border p-1 rounded border-black/20 text-[11px]">
            <button onClick={() => decreaseProductCount(item)} className="text-blue-600 font-bold px-2 cursor-pointer hover:scale-150 transition-all duration-100 ease-in">
              -
            </button>
            <span className="px-2">{item.quantity}</span>
            <button onClick={() => increaseProductCount(item)} className="text-blue-600 font-bold px-2 cursor-pointer hover:scale-150 transition-all duration-100 ease-in">
              +
            </button>
          </div>
          <p className="text-blue-800 font-bold sm:text-[14px] text-[12px]">
            Rs {(item.product.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
