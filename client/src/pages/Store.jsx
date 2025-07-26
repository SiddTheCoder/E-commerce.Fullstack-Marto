import React, { useEffect, useState } from "react";
import PageBacker from "../components/PageBacker";
import { useDispatch, useSelector } from "react-redux";
import { getAllStores, getCurrentStoreProducts } from "../features/store/storeThunks";
import { setCurrentStore } from "../features/store/storeSlice";
import { Listbox } from "@headlessui/react";
import {
  ChevronDown,
  Container,
  Building2,
  Landmark,
  Store as StoreIcon,
  Plus,
  Box,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CreateStoreModal from "../components/CreateStoreModal";
import Lottie from "lottie-react";
import CreateNewAnimated from "../assets/create-new-animated-logo.json";
import CreateProductModal from "../components/CreateProductModal";
import { setProducts } from "../features/product/productSlice";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllProducts } from "../features/product/productThunks";

export default function Store() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [storeCreatemodalOpen, setStoreCreateModalOpen] = useState(false);
  const [productCreatemodalOpen, setProductCreateModalOpen] = useState(false);
  const { stores, currentStore, currentStoreProducts } = useSelector(
    (state) => state.store
  );
  const { loading } = useSelector((state) => state.product);
  const products = currentStoreProducts || [];
  const { user } = useSelector((state) => state.user);

  console.log("Products at Store", products);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "seller") {
      navigate("/");
      toast.error("Become Seller First");
    }
  }, []);

  useEffect(() => {
    dispatch(getCurrentStoreProducts());
  }, [dispatch, currentStore]);

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  const handleStoreChange = (selectedStore) => {
    if (selectedStore._id === "new-store") {
      console.log("Redirect to create new store");
    } else {
      localStorage.setItem("selectedStoreId", selectedStore._id);
      dispatch(setCurrentStore(selectedStore));
    }
  };

  // Get icon by store index or type (mock logic for uniqueness)
  const getStoreIcon = (index, type = "default") => {
    const icons = [StoreIcon, Building2, Landmark];
    return icons[index % icons.length] || StoreIcon;
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-100/10">
      {/* Header */}
      <header className="bg-slate-100/10 shadow-md pl-4 flex justify-between items-center h-14 w-full pr-5 py-4 sticky top-0 z-50">
        <PageBacker />

        <div className="flex text-[12px] items-center gap-2  py-1 cursor-pointer rounded-md transition-all">
          {stores.length === 0 ? (
            <span onClick={() => setStoreCreateModalOpen(true)}>
              Create new store
            </span>
          ) : (
            <Listbox value={currentStore} onChange={handleStoreChange}>
              <div className="relative w-28 bg-blue-200/30 hover:bg-blue-200/50 hover:text-blue-900">
                <Listbox.Button className="relative w-full cursor-pointer rounded-md py-1.5 pl-3 pr-10 text-left text-blue-800 shadow-sm text-sm">
                  <span className="block truncate">
                    {currentStore?.storeName || "Select Store"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-2 top-1 flex items-center pr-2">
                    <ChevronDown size={16} />
                  </span>
                </Listbox.Button>

                <AnimatePresence>
                  <Listbox.Options
                    as={motion.ul}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 mt-1 max-h-60 w-44 right-1 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg"
                  >
                    {stores.map((store, index) => {
                      const Icon = getStoreIcon(index);
                      return (
                        <Listbox.Option
                          key={store._id}
                          value={store}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-4 pr-4 flex items-center gap-2 ${
                              active
                                ? "bg-blue-100 text-blue-900"
                                : "text-gray-900"
                            }`
                          }
                        >
                          <Icon size={16} />
                          {store.storeName}
                        </Listbox.Option>
                      );
                    })}
                    <Listbox.Option
                      onClick={() => setStoreCreateModalOpen(true)}
                      value={{ _id: "new-store", storeName: "New Store" }}
                      className="cursor-pointer py-2 pl-4 pr-4 text-blue-700 hover:bg-blue-100 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Create New Store
                    </Listbox.Option>
                  </Listbox.Options>
                </AnimatePresence>
              </div>
            </Listbox>
          )}
          {/* Create Store Model */}
          {storeCreatemodalOpen && (
            <CreateStoreModal onClose={() => setStoreCreateModalOpen(false)} />
          )}

          <div className="relative group">
            {/* The main box */}
            <div
              onClick={(e) => {
                if (stores.length === 0) {
                  toast.error("Create a store first");
                } else {
                  setProductCreateModalOpen(true);
                }
              }}
              className="hover:bg-blue-500 hover:text-blue-50 bg-blue-100 text-black rounded-md p-2 flex items-center justify-center"
            >
              <Box size={20} />
            </div>

            {/* Tooltip or absolute message */}
            <div className="absolute top-full  -left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-blue-700 text-center text-white text-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-36">
              Create new product
            </div>
          </div>
        </div>

        {productCreatemodalOpen && (
          <CreateProductModal
            onClose={() => setProductCreateModalOpen(false)}
          />
        )}
      </header>

      {/* Body */}
      {stores.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center relative">
          <span className="text-[14px] absolute top-10">
            Create your first store.{" "}
            <span
              onClick={() => setStoreCreateModalOpen(true)}
              className="text-white p-1 text-[15px] cursor-pointer highlight-tilt"
            >
              Create
            </span>
          </span>
          <span>
            <Lottie
              className="w-full"
              animationData={CreateNewAnimated}
              loop={true}
            />
          </span>
        </div>
      ) : (
        // Actual Data
        <div className="flex-1 overflow-y-auto px-5 py-3 z-10 relative">
          {/* Banner */}
          <div className="h-58 w-full rounded-md bg-slate-400/50 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={currentStore?.banner}
              alt="Store Banner"
            />
          </div>

          {/* Store Info */}
          <div className="h-32 w-full flex justify-between items-center pr-0">
            <div className="flex gap-3 items-center h-full justify-center">
              <div className="h-26 w-26 rounded-full bg-blue-700 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={currentStore?.logo}
                  alt="Store Logo"
                />
              </div>
              <div className="flex flex-col">
                <span>{currentStore?.storeName}</span>
                <span>{currentStore?.likes?.length || 0} Likes</span>
              </div>
            </div>
            <div className="p-2 rounded-md text-[13px] text-back cursor-pointer highlight-tilt text-white  transition-all duration-100 ease-in">
              {currentStore.owner === user._id ? "Customize" : "Like"}
            </div>
          </div>

          <div className="w-full flex justify-center border-b-2 border-slate-300/30"></div>

          {/* Products */}
          <div className="px-1 w-full flex flex-col gap-3 mt-2">
            <div className="w-full px-2">
              <span className="p-1 text-white highlight-tilt">Products</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {products &&
                products?.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    loading={loading}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
