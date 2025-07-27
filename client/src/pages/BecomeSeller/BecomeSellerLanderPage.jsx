import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageBacker from "../../components/PageBacker";
import BecomeSellerModal from "./BecomeSellerModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import DashboardPreviewImage from "../../assets/dashboard-preview.png";
import HomePagePreviewImg from "../../assets/more-access-to-sidebar.png";
import StorePreviewImg from "../../assets/store-preview.png";
import MoreStatPreviewImg from "../../assets/more-stat-preview.png";
import ProductPreviewImg from "../../assets/product-preview.png";
import CreateStorePreviewImg from "../../assets/create-store-preview.png";

const WORD = "Anbari";
const SYMBOLS = "0SCB87675HJGS##&";

function scrambleWord(targetWord, delay = 1) {
  let i = 0;
  const steps = [];
  while (i <= targetWord.length) {
    let frame = "";
    for (let j = 0; j < targetWord.length; j++) {
      if (j < i) frame += targetWord[j];
      else frame += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }
    steps.push(frame);
    i++;
  }
  return steps;
}

export default function BecomeSeller() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedWord, setDisplayedWord] = useState(WORD);

  const [currentImage, setCurrentImage] = useState(0);

  const imageSlides = [
    { src: DashboardPreviewImage, text: "Dashboard Overview" },
    { src: HomePagePreviewImg, text: "Home with Sidebar Access" },
    { src: StorePreviewImg, text: "Your Storefront Preview" },
    { src: MoreStatPreviewImg, text: "Extended Statistics Page" },
    { src: ProductPreviewImg, text: "Manage Your Products" },
    { src: CreateStorePreviewImg, text: "Create a New Store Easily" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imageSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      const steps = scrambleWord(WORD, 1);
      steps.forEach((step, index) => {
        setTimeout(() => {
          setDisplayedWord(step);
        }, index * 100);
      });
    };

    setTimeout(() => {
      animate(); // initial run
    }, 500);

    const interval = setInterval(() => {
      animate();
    }, 10000); // changed from 14000 to 20000

    return () => clearInterval(interval);
  }, []);

  

  return (
    <div className="relative w-full h-screen bg-white flex flex-col items-center px-4">
      <div className="w-full p-5 ">
        <PageBacker />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-black text-4xl md:text-8xl font-bold text-center relative top-0 z-50"
      >
        Become <span className="highlight-tilt py-1 px-4">Seller</span> at{" "}
        <span className="text-9xl font-mono tracking-tight">
          {displayedWord}
        </span>
      </motion.h1>

      {/* Images start */}
      {
        <>
          <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[60vw] h-[26rem] flex items-center justify-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border-2 border-blue-800"
            >
              <img
                src={imageSlides[currentImage].src}
                className="w-full h-full object-cover"
                alt="Preview"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-lg font-semibold p-3 text-center">
                {imageSlides[currentImage].text}
              </div>
            </motion.div>

            {/* Previous Button */}
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? imageSlides.length - 1 : prev - 1
                )
              }
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-blue-700 text-white p-2 rounded-full hover:bg-blue-900 transition"
            >
              &#8592;
            </button>

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentImage((prev) => (prev + 1) % imageSlides.length)
              }
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-blue-700 text-white p-2 rounded-full hover:bg-blue-900 transition"
            >
              &#8594;
            </button>
          </div>
        </>
      }

      <motion.button
        onClick={() => {
          if (!user) {
            toast.error("Please login to become a seller");
            navigate("/login");
          }
          setIsModalOpen(true)
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 -translate-y-1/10 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer hover:scale-105"
      >
        Get Started
      </motion.button>

      {/* Border Decorations start */}
      {
        <>
          <div className="absolute top-0 left-0 w-full h-1">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-full bg-blue-900"
            />
          </div>

          <div className="absolute bottom-0 right-0 w-full flex justify-end h-1">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-full bg-blue-900"
            />
          </div>

          <div className="absolute left-0 w-1">
            <motion.div
              initial={{ height: "1vh" }}
              animate={{ height: "100vh" }}
              transition={{ duration: 2 }}
              className="h-full bg-blue-900"
            />
          </div>

          <div className="absolute  right-0 w-1">
            <motion.div
              initial={{ height: "1vh" }}
              animate={{ height: "100vh" }}
              transition={{ duration: 2 }}
              className="h-full bg-blue-900"
            />
          </div>
        </>
      }
      {/*Border Decorations end */}
      {isModalOpen && (
        <BecomeSellerModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
