import React, { useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import LoaderModal from "../components/LoaderModal";
import ProductCard from "../components/ProductCard";
import BannerSection from "../components/BannerSection";
import GreetSellerModel from "./BecomeSeller/GreetSellerModel";

import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../features/product/productThunks";

function Home() {
  
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.product);
  const [isSellerGreetModelOpen, setIsSellerGreetModelOpen] =
    React.useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === "seller" && user?.isDashboardVisited === false) {
      setIsSellerGreetModelOpen(true);
    }
  }, [user]);

  if (loading) return <LoaderModal />;

  return (
    <>
      <div className="h-full w-full flex flex-col bg-slate-100/10 scroll-smooth">
        {/* Header */}
        <header className="bg-slate-100/10 shadow-md sm:pl-4 flex justify-between items-center h-14 w-full sm:pr-5 py-4 sticky top-0 z-50">
          <Header />
        </header>

        <main className="flex-1 overflow-y-auto px-5 py-4 z-10 relative">
          {/* Banner - Advertisement */}
          <div className="w-full h-36 sm:h-64 mb-5 rounded flex items-center justify-center p-1">
            <BannerSection />
          </div>

          {/* Product */}
          <div className="w-full p-2 mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {products?.length > 0 &&
                [...products]
                  .reverse()
                  .map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      loading={loading}
                      viewLocation="home"
                    />
                  ))}
            </div>
          </div>
        </main>

        {isSellerGreetModelOpen && (
          <GreetSellerModel onClose={() => setIsSellerGreetModelOpen(false)} />
        )}
      </div>
    </>
  );
}

export default Home;
