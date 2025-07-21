import React, { useState, useEffect } from "react";
import {
  Star,
  StarHalf,
  StarOff,
  Heart,
  ShoppingCart,
  BadgePercent,
  CheckCircle,
  PencilLine,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { toggleProductToWishList } from "../features/wishList/wishListThunk";
import { toggleProductToCart } from "../features/cart/cartThunks";

const ProductCard = ({ loading, product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { screenView } = useSelector((state) => state.localState);
  const { cartProducts } = useSelector((state) => state.cart);

  
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    if (user?.wishListProducts?.length) {
      const initial = {};
      user.wishListProducts.forEach((id) => (initial[id] = true));
      setWishlist(initial);
    }
  }, [user]);

  const toggleWishlist = async (productId) => {
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
    try {
      await dispatch(toggleProductToWishList({ productId })).unwrap();
    } catch (error) {}
  };

  const toggleCart = async (productId) => {
    try {
      await dispatch(toggleProductToCart({ productId })).unwrap();
    } catch (error) {
      toast.error("Unable to toggle");
    }
  };

  const handleOpenProductShowCase = () => {
    navigate(`/product/${product._id}`, {
      state: {
        backgroundLocation: location,
        product: product,
      },
    });
  };

  const renderStars = () => {
    const stars = [];
    const full = Math.floor(product?.ratings?.average || 0);
    const hasHalf = product?.ratings?.average % 1 >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    for (let i = 0; i < full; i++) {
      stars.push(
        <Star
          key={`f-${i}`}
          size={14}
          className="text-yellow-400 fill-yellow-400"
        />
      );
    }
    if (hasHalf) {
      stars.push(
        <StarHalf
          key="half"
          size={14}
          className="text-yellow-400 fill-yellow-600"
        />
      );
    }
    for (let i = 0; i < empty; i++) {
      stars.push(
        <StarOff key={`e-${i}`} size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  const display = !loading && product;


  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-black/40 p-2 max-w-xs ${
        screenView === "mobile" ? "mb-3 w-[42vw]" : "mb-0 w-full"
      }`}
    >
      {display ? (
        <>
          <div
            className={`relative w-full ${
              screenView === "mobile" ? "h-28" : "h-40"
            } overflow-hidden rounded-md mb-2 group`}
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {(!user || user?._id !== product?.seller) && (
              <button
                onClick={() => {
                  if (user) {
                    toggleWishlist(product._id);
                  } else {
                    toast.error("Please Login First");
                    navigate("/");
                  }
                }}
                className={`absolute top-1 right-1 p-0.5 rounded-full shadow transition cursor-pointer ${
                  wishlist[product._id]
                    ? "bg-red-100 text-red-600"
                    : "bg-white text-blue-600 hover:bg-blue-100"
                }`}
              >
                <Heart
                  size={18}
                  className={wishlist[product._id] ? "fill-red-600" : ""}
                />
              </button>
            )}
          </div>

          <div
            onClick={handleOpenProductShowCase}
            className="space-y-1 cursor-pointer"
          >
            <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
              {product.title}
            </h2>
            <p className="text-[15px] font-bold text-blue-600">
              Rs {product.price - (product.price * product.discount) / 100}
            </p>
            <div className="flex items-center gap-1">
              <p
                className={`text-[13.5px] font-bold text-blue-600/50 line-through ${
                  product.discount > 0 ? "" : "hidden"
                }`}
              >
                Rs {product.price}
              </p>
              {product.discount > 0 && (
                <div className="flex items-center text-[16px] text-red-500">
                  <BadgePercent size={11} className="mr-0.5 mt-0.5" />
                  <div>{product.discount}%</div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {renderStars()}
              <span className="text-[10px] text-gray-400 ml-1">
                ({product?.ratings?.count})
              </span>
            </div>
          </div>

          <div className="mt-2 flex justify-end items-center">
            <div className="flex gap-1">
              {user?._id !== product.seller ? (
                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      toggleCart(product._id);
                    } else {
                      toast.error("Please login first !");
                    }
                  }}
                  className={`group flex items-center gap-1 rounded-full px-2 py-1 h-7 text-white text-[11px] transition-all duration-300 cursor-pointer ${
                    cartProducts.some(
                      (item) =>
                        item.product?.toString() === product._id.toString()
                    )
                      ? "bg-blue-600"
                      : "bg-gradient-to-bl from-blue-400 to-blue-800 hover:from-blue-800 hover:to-blue-700"
                  }`}
                >
                  {cartProducts.some(
                    (item) =>
                      item.product?._id?.toString() === product._id.toString()
                  ) ? (
                    <CheckCircle size={14} />
                  ) : (
                    <ShoppingCart size={14} />
                  )}
                  <span className="hidden sm:inline">
                    {cartProducts.some(
                      (item) =>
                        item.product?._id?.toString() === product._id.toString()
                    )
                      ? "Added"
                      : "Add"}
                  </span>
                </button>
              ) : (
                <button className="p-1 cursor-pointer rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
                  <PencilLine size={16} />
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="animate-pulse space-y-3">
          <div className="w-full h-40 bg-gray-200 rounded-lg" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 w-12 bg-gray-200 rounded-full" />
            <div className="h-5 w-12 bg-gray-200 rounded-full" />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-gray-200" />
              <div className="h-7 w-7 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
