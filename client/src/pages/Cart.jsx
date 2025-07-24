import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartProducts } from "../features/cart/cartThunks";
import PageBacker from "../components/PageBacker";
import CartItem from "../components/CartItem";
import { AnimatePresence, motion } from "framer-motion";
import { Omega } from "lucide-react"; // Assuming Omega is an icon you want to use
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../features/order/orderThunks";
import UserDetails from "../components/user/UserDetails";

import AddToCartAnimationImg from "../assets/Add_to-Cart.json";
import Lottie from "lottie-react";


function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.order);
  const { cartProducts } = useSelector((state) => state.cart);

  const [isUserDetailsOpen, setIsUserDetailsOpen] = React.useState(false);

  const { user } = useSelector((state) => state.user);

  const missingDetails =
    !user?.fullName ||
    !user?.age ||
    !user?.phoneNumber ||
    !user?.address ||
    !user?.country ||
    !user?.city ||
    !user?.district ||
    !user?.postalCode;

  useEffect(() => {
    dispatch(getCartProducts());
  }, [dispatch]);

  const totalAmounts = cartProducts
    ?.map((cartProduct) => {
      return (
        (cartProduct.product.price -
          cartProduct.product.price * (cartProduct.product.discount / 100)) *
        cartProduct.quantity
      );
    })
    .reduce((acc, amount) => acc + amount, 0);

  const handleBuyProductFromCart = async () => {
    if (cartProducts.length === 0) {
      toast.error("Cart is empty 😔");
      return;
    }
    if (missingDetails) {
      toast.error("Please fill in your details");
      setIsUserDetailsOpen(true);
      return;
    }
    // interface ProductData = [ {
    //   productId: string;
    //   sellerId: string;
    //   quantity: number;
    // } ]
    // interface BODY__FOR__PLACE__ORDER(orderData) {
    //   productData: ProductData[];
    //   paymentMethod: string;
    //   totalAmount: number;
    //   fromCart: Boolean;
    // }

    // returns an array of product objects
    const products = cartProducts.map((cartProduct) => {
      return {
        productId: cartProduct.product._id,
        quantity: cartProduct.quantity,
        sellerId: cartProduct.product.seller,
      };
    });

    const amount = cartProducts
      ?.map((cartProduct) => {
        return (
          (cartProduct.product.price -
            cartProduct.product.price * (cartProduct.product.discount / 100)) *
          cartProduct.quantity
        );
      })
      .reduce((acc, amount) => acc + amount, 0);

    const orderData = {
      productData: products,
      paymentMethod: "COD",
      totalAmount: amount,
      fromCart: true,
    };

    console.log("orderData", orderData);
    if (!orderData) return;
    try {
      await dispatch(placeOrder(orderData)).unwrap();
      toast.success("🎉 Order placed successfully!");
      navigate("/products");
    } catch (error) {
      console.log("error at placing order", error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-100/10">
      {isUserDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-y-auto max-h-[90vh] relative">
            <UserDetails onClose={() => setIsUserDetailsOpen(false)} />
          </div>
        </div>
      )}
      {/* Sticky Header */}
      <header className="bg-slate-100/10 shadow-md pl-4 flex justify-between items-center h-14 w-full pr-5 py-4 sticky top-0 z-50">
        <PageBacker />

        <div className="flex justify-center items-center gap-4">
          <span>
            Total : Rs{" "}
            <span className="font-bold">{totalAmounts?.toFixed(2)}</span>
          </span>

          {/* Divider */}
          <div className="h-5 w-0.5 bg-blue-400 rounded-full"></div>

          <span
            onClick={handleBuyProductFromCart}
            className="bg-blue-400 hover:bg-blue-500 transition-all duration-150 ease-in py-2 px-4 rounded-md cursor-pointer text-sm flex items-center gap-1 hover:gap-3 text-white"
          >
            <Omega className="w-4 h-4" />{" "}
            {loading ? "Placing Order..." : "Buy Now"}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-5 py-3 z-10 relative">
        {" "}
        {/* pt-20 to give space below fixed header */}
        <h1 className="text-2xl font-bold mb-6 text-blue-900">
          Your Cart Products
        </h1>
        <AnimatePresence>
          {cartProducts?.length > 0 ? (
            [...cartProducts]
              .reverse()
              .map((item) => <CartItem key={item._id} item={item} />)
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-10 w-full h-[70vh] flex flex-col justify-start items-center gap-4"
            >
              <div>
                Your cart is empty.{" "}
                <span
                  onClick={() => navigate("/")}
                  className="highlight-tilt text-black px-4 py-1 cursor-pointer"
                >
                  Shop Now !
                </span>
              </div>
              <Lottie loop={true} animationData={AddToCartAnimationImg} />
            </motion.div>
          )}
        </AnimatePresence>
        {cartProducts?.length > 0 && (
          <div className="h-14 w-full text-white flex items-center justify-end py-2 px-10">
            <span
              onClick={handleBuyProductFromCart}
              className="bg-blue-400 hover:bg-blue-500 transition-all duration-150 ease-in py-2 px-4 rounded-md cursor-pointer text-sm flex items-center gap-1 hover:gap-3 text-white"
            >
              <Omega className="w-4 h-4" />{" "}
              {loading ? "Placing Order..." : "Buy Now"}
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
