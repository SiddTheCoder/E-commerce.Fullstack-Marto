import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserDetails from "./user/UserDetails";

import {
  Truck,
  Wallet,
  Undo2,
  ShieldOff,
  Store,
  ThumbsUp,
  Timer,
  ExternalLink,
  MapPin,
  Phone,
  Pencil,
  User,
  Calendar,
  Globe,
  Home,
  Map,
  Hash,
} from "lucide-react";

export default function ProductShowcaseSidebar({ product }) {
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
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

  return (
    <>
      {/* User Details Modal (fullscreen and centered) */}
      {showUserDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-y-auto max-h-[90vh] relative">
            <UserDetails onClose={() => setShowUserDetailsModal(false)} />
          </div>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="space-y-6 mt-8 p-4 border border-black/20 rounded-lg bg-white w-full text-sm flex flex-col relative">
        {/* Delivery Info Section */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Your Details</h3>
          {missingDetails ? (
            <button
              onClick={() => setShowUserDetailsModal(true)}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              + Add Your Details
            </button>
          ) : (
            <div className="text-gray-700 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  
                  <p className="flex items-center gap-2">
                    <Phone size={16} /> {user.phoneNumber}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} /> {user.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Home size={16} /> {user.city}
                  </p>
                  <p className="flex items-center gap-2">
                    <Map size={16} /> {user.district}
                  </p>
                  
                </div>
                <button
                  className="flex items-center text-blue-500 hover:underline text-xs gap-1 cursor-pointer"
                  onClick={() => setShowUserDetailsModal(true)}
                >
                  <Pencil size={14} /> Edit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Options */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Delivery Options</h3>
          <div className="mt-3 space-y-1 text-gray-800">
            <p className="flex items-center gap-2">
              <Truck size={16} /> Standard Delivery (23–27 Jul)
            </p>
            <p className="flex items-center gap-2">
              <Wallet size={16} /> Cash on Delivery Available
            </p>
          </div>
        </div>

        {/* Return & Warranty */}
        <div className="border-t border-gray-300 pt-4">
          <h3 className="font-semibold text-lg mb-2">Return & Warranty</h3>
          <p className="flex items-center gap-2 text-gray-800">
            <Undo2 size={16} /> 14 Days Free Returns
          </p>
          <p className="flex items-center gap-2 text-gray-800">
            <ShieldOff size={16} />
            {product.warranty ? "Warranty Available" : "No Warranty"}
          </p>
        </div>

        {/* Seller Info */}
        <div className="border-t border-gray-300 pt-4">
          <h3 className="font-semibold text-lg mb-2">Sold by</h3>
          <p className="flex items-center gap-2 text-gray-700">
            <Store size={16} /> {product?.store?.storeName || "Unknown Seller"}
          </p>
          <p className="flex items-center gap-2 text-gray-800">
            <ThumbsUp size={16} /> 81% Positive Seller Rating
          </p>
          <p className="flex items-center gap-2 text-gray-800">
            <Timer size={16} /> {product?.store?.shippingTimeScore || "100"}%
            Ship on Time
          </p>
        </div>

        {/* Store Link */}
        <div className="border-t border-gray-300 pt-4 text-center">
          <Link
            to={`/store/${product?.store?._id}`}
            className="flex items-center gap-1 mx-auto text-blue-600 hover:underline hover:text-blue-700 transition"
          >
            Go to Store <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
