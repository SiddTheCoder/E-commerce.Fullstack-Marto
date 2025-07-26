import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../features/product/productThunks";
import { useSelector, useDispatch } from "react-redux";
import ProductShowcaseSidebar from "../../components/ProductShowcaseSidebar";
import ProductReviews from "./ProductReviews";
import { toggleProductToCart } from "../../features/cart/cartThunks";
import toast from "react-hot-toast";
import { placeOrder } from "../../features/order/orderThunks";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { toggleProductToWishList } from "../../features/wishList/wishListThunk";

export default function ProductShowcase({ isModal = false, product = null }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { cartProducts } = useSelector((state) => state.cart);

  const isProductInCart = cartProducts.some(
    (cartProduct) => cartProduct.product._id === productId
  );

  const { loading, currentProduct } = useSelector((state) => state.product);
  const selectedProduct = product || currentProduct;

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!product && productId) {
      dispatch(getProductById(productId));
    }
  }, [product, productId, dispatch]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setSelectedImage(selectedProduct.images[0]);
      setCurrentImageIndex(0);
    }
  }, [selectedProduct]);

  const handleClose = () => {
    navigate(-1);
  };

  if (!selectedProduct)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );

  const {
    title,
    images = [],
    price,
    discount = 0,
    description,
    category,
    brand,
    features = [],
    ratings = {},
    stock = 0,
  } = selectedProduct;

  const discountedPrice = Math.round(price - (price * discount) / 100);

  const selectedProductFromCart = cartProducts.find(
    (cartProduct) => cartProduct.product._id === selectedProduct._id
  );

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const handleProductBuyNow = async () => {
    let amount = 0;

    const selectedProductFromCart = cartProducts.find(
      (cartProduct) => cartProduct.product._id === selectedProduct._id
    );

    if (selectedProductFromCart) {
      amount =
        selectedProductFromCart.product.price -
        selectedProductFromCart.product.price *
          (selectedProductFromCart.product.discount / 100);
    } else {
      amount =
        selectedProduct.price -
        selectedProduct.price * (selectedProduct.discount / 100);
    }

    const orderData = {
      productData: [
        {
          productId: selectedProduct._id,
          sellerId: selectedProduct.seller,
          quantity: quantity,
        },
      ],
      paymentMethod: "COD",
      totalAmount: amount * quantity,
      fromCart: false,
    };

    try {
      const id = toast.loading("Placing order...");
      await dispatch(placeOrder(orderData)).unwrap();
      toast.dismiss(id);
      toast.success("🎉 Order placed successfully!");
      navigate("/products");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  const breadcrumbs = ["Products", category || "Category", brand || "Brand"];

  return (
    <div
      className={`${
        isModal
          ? "fixed inset-0 z-[50] bg-black/40 flex flex-col items-center justify-center"
          : "min-h-screen bg-white"
      }`}
    >
      <div
        className={`${
          isModal
            ? "bg-white rounded-xl shadow-xl w-[95%] h-[95%] overflow-y-auto"
            : "w-full"
        }`}
      >
        {/* Modal Header */}
        {isModal && (
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4 flex justify-end">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        {!isModal && (
          <nav className="px-6 py-4 border-b border-gray-200">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb}>
                    <span className="hover:text-gray-900 cursor-pointer">
                      {crumb}
                    </span>
                    {index < breadcrumbs.length - 1 && (
                      <span className="text-gray-400">›</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </nav>
        )}

        <div className="max-w-0xl mx-auto px-6 py-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-[100%] bg-gray-50 rounded-2xl overflow-hidden h-[70vh] aspect-square flex items-center justify-center">
                <img
                  src={selectedImage || images[0]}
                  alt={title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(image);
                      setCurrentImageIndex(index);
                    }}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      currentImageIndex === index
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {images.length > 4 && (
                  <div className="flex items-center justify-center w-20 h-20 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium flex-shrink-0">
                    +{images.length - 4} more
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Brand and SKU */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {brand ? brand.charAt(0).toUpperCase() : "B"}
                    </span>
                  </div>
                  <span className="text-gray-600 font-medium">
                    {brand || "Brand"}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {selectedProduct._id?.slice(-8) || "SKU123"}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(ratings?.average || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">
                  {ratings?.count || 0} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-900">
                  Rs. {discountedPrice}
                </div>
                {discount > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-500 line-through">
                      Rs. {price}
                    </span>
                    <span className="text-green-600 font-semibold">
                      -{discount}% off
                    </span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="text-sm">
                <span className="text-gray-600">Stock: </span>
                {stock > 0 ? (
                  <span className="text-green-600 font-semibold">
                    {stock} available
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    Out of stock
                  </span>
                )}
              </div>

              {/* Quantity Selection */}
              <div className="space-y-3">
                <span className="text-gray-900 font-medium">Quantity</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-200 rounded-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              {user._id !== selectedProduct.seller ? (
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <button
                      disabled={
                        stock === 0 ||
                        !(
                          user.address ||
                          user.phone ||
                          user.shippingAddress ||
                          user.city ||
                          user.country ||
                          user.district ||
                          user.postalCode
                        )
                      }
                      onClick={handleProductBuyNow}
                      className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                        stock === 0 ||
                        !(
                          user.address ||
                          user.phone ||
                          user.shippingAddress ||
                          user.city ||
                          user.country ||
                          user.district ||
                          user.postalCode
                        )
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      <span>
                        {stock === 0
                          ? "Out of stock"
                          : loading
                          ? "Buying..."
                          : "Buy Now"}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        dispatch(toggleProductToWishList({ productId }))
                      }
                      className={`p-4 rounded-lg border-2 transition-all ${
                        user.wishListProducts?.includes(productId)
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          user.wishListProducts?.includes(productId)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    disabled={stock === 0}
                    onClick={() => dispatch(toggleProductToCart({ productId }))}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                      stock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isProductInCart
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      {isProductInCart ? "Added to Cart" : "Add to Cart"}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <button className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Edit Product
                  </button>
                </div>
              )}

              {/* Delivery Info */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 text-sm">
                  Free delivery on orders over Rs. 1000
                </span>
              </div>

              {/* Product Features */}
              {features.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Product Features
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar and Reviews */}
          <div className="mt-16 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProductReviews />
            </div>
            <div>
              <ProductShowcaseSidebar product={selectedProduct} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
