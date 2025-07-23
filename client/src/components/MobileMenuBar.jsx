import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MessageCircle,
  Settings,
  Box,
} from "lucide-react";

const MobileMenuBar = () => {
  const menuItems = [
    { to: "/cart", icon: ShoppingBag },
    { to: "/wishlist", icon: Heart },
    { to: "/", icon: LayoutDashboard },
    { to: "/products", icon: Box },
    { to: "/settings", icon: Settings },
  ];
  

  return (
    <div className="flex items-center justify-around p-3 bg-blue-900 shadow-md w-full h-14 fixed bottom-0 left-0 z-50 rounded-t-2xl">
      {menuItems.map(({ to, icon: Icon }, index) => (
        <NavLink
          key={index}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-xs transition-all
            ${isActive ? "text-blue-500 transform bg-white/90 h-16 w-16 rounded-full  -translate-y-3" : "text-white"}`
          }
        >
          <Icon className="w-5 h-5" />
        </NavLink>
      ))}
    </div>
  );
};

export default MobileMenuBar;
