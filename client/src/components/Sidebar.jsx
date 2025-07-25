import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { getAllStores } from "../features/store/storeThunks";
import {
  LayoutDashboard,
  Trophy,
  ShoppingCart,
  Box,
  BarChart2,
  MessageCircle,
  Settings,
  LogOut,
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Store,
  AlignJustify,
  Slack,
  Speech,
  Home,
} from "lucide-react";

import Lottie from "lottie-react";
import CompanyLogo from "../assets/animated-logo-cart.json";
import BecomeSeller from "../assets/Seller-Animation.json";
import { setIsSideBarCollapsed } from "../features/localState/localStateSlice";
import Confirmer from "./Confirmer";
import { getCartProducts } from "../features/cart/cartThunks";

const Sidebar = () => {
  const hasPrefetchedStores = useRef(false);
  const { hasFetched } = useSelector((state) => state.store);
  const hasPrefetchedCart = useRef(false);
  const { hasCartFetched } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { isSideBarCollapsed } = useSelector((state) => state.localState);
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(false);
  const [isLogoutConfirmerOn, setIsLogoutConfirmerOn] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const isOpen = !isSideBarCollapsed;

  const toggleSidebar = () => {
    localStorage.setItem("isSideBarCollapsed", !isSideBarCollapsed);
    dispatch(setIsSideBarCollapsed(!isSideBarCollapsed));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/cart", icon: ShoppingBag, label: "Cart" },
    { to: "/products", icon: Box, label: "Products" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
    { to: "/messages", icon: MessageCircle, label: "Messages" },
  ];

  const sellerLinks = [
    { to: "/orders", icon: ShoppingCart, label: "Orders" },
    { to: "/stores", icon: Store, label: "Stores" },
    { to: "/sales-report", icon: BarChart2, label: "Sales Report" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const navItems =
    user?.role === "seller" ? [...baseLinks, ...sellerLinks] : baseLinks;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 bg-white shadow-md flex flex-col justify-between ${
          isOpen ? "w-[250px]" : "w-[75px]"
        }`}
      >
        {/* Top Section */}
        <div className="p-4 relative">
          {/* Logo and toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!!isOpen && (
                <>
                  <Lottie
                    animationData={CompanyLogo}
                    loop
                    className="w-8 h-8"
                  />
                  <h1 className="text-lg font-bold text-blue-600">Anbari</h1>
                </>
              )}
            </div>

            <button
              onClick={toggleSidebar}
              className="p-1 mr-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition cursor-e-resize"
            >
              {isOpen ? <ChevronLeft size={23} /> : <AlignJustify size={23} />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 flex flex-col gap-1">
            {navItems.map(({ to, icon: Icon, label }, index) => {
              const isStoresLink = to === "/stores";
              const isCartLink = to === "/cart";

              return (
                <div
                  key={index}
                  className={`relative flex flex-col justify-start ${
                    isSideBarCollapsed
                      ? "items-center h-[50px] "
                      : "items-start w-full"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <NavLink
                    onMouseEnter={() => {
                      if (
                        isStoresLink &&
                        (!hasPrefetchedStores.current || !hasFetched)
                      ) {
                        dispatch(getAllStores());
                        hasPrefetchedStores.current = true;
                      }
                      if (
                        isCartLink &&
                        (!hasPrefetchedCart.current || !hasCartFetched)
                      ) {
                        dispatch(getCartProducts());
                        hasPrefetchedCart.current = true;
                      }
                    }}
                    onClick={() => {
                      localStorage.setItem("isSideBarCollapsed", true);
                      dispatch(setIsSideBarCollapsed(true));
                    }}
                    to={to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 ${
                        isOpen ? "w-full justify-start" : "justify-center"
                      } px-3 py-2 rounded-md text-[12px] font-medium transition-all relative ${
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {isOpen ? (
                      <span>{label}</span>
                    ) : (
                      <span className="absolute left-full ml-2 bg-blue-950 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
                        {label}
                      </span>
                    )}
                  </NavLink>

                  {/* Label BELOW the icon — FIXED and SMOOTHLY animated */}
                  {!isOpen && (
                    <span
                      className={`absolute top-[30px] text-[10px] text-gray-500 transition-opacity duration-200 truncate ${
                        hoveredIndex === index ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="px-4 py-2 border-t border-gray-200 mb-3">
          <div className="flex flex-col gap-2">
            {/* Become Seller */}
            {user && user.role === "consumer" && (
              <Link
                to="/become-seller"
                className="cursor-pointer group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-red-50 transition-colors relative"
              >
                <Speech className="w-[18px] h-[18px]" />
                {isOpen ? (
                  <span>Become Seller</span>
                ) : (
                  <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Become Seller
                  </span>
                )}
              </Link>
            )}

            {/* Dashboard */}
            {user && user.role === "seller" && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:bg-orange-200"
                  }`
                }
              >
                <LayoutDashboard className="w-[18px] h-[18px]" />
                {isOpen ? (
                  <span>Dashboard</span>
                ) : (
                  <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Dashboard
                  </span>
                )}
              </NavLink>
            )}

            {/* Settings */}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                }`
              }
            >
              <Settings className="w-[18px] h-[18px]" />
              {isOpen ? (
                <span>Settings</span>
              ) : (
                <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Settings
                </span>
              )}
            </NavLink>

            {/* Logout */}
            {user && (
              <div
                onClick={() => setIsLogoutConfirmerOn(true)}
                className="cursor-pointer group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors relative"
              >
                <LogOut className="w-[18px] h-[18px]" />
                {isOpen ? (
                  <span>Logout</span>
                ) : (
                  <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Logout
                  </span>
                )}
              </div>
            )}

            {isLogoutConfirmerOn && (
              <Confirmer
                confirmatoryText={"Are You sure want to Logout ?"}
                action={handleLogout}
                onClose={() => setIsLogoutConfirmerOn(false)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
