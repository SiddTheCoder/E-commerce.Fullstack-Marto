import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { getCurrentUser } from "./features/user/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { setIsSideBarCollapsed } from "./features/localState/localStateSlice";
import { useEffect } from "react";
import { subscribeUserToPush } from "./utils/notificationPush";

import LoaderModal from "./components/LoaderModal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleCallback from "./pages/Oauth-pages/GoogleCallback";

import Dashboard from "./pages/Dashboard/Dashboard";
import WishList from "./pages/WishList";
import MessagePage from "./pages/MessagePage";
import SettingLayout from "./pages/Setting/SettingLayout";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Store from "./pages/Store";
import PageNotFound from "./pages/PageNotFound";
import Cart from "./pages/Cart";
import { getCartProducts } from "./features/cart/cartThunks";
import SearchPage from "./pages/SearchPage";
import ProductPage from "./pages/ProductPage";
import OrderPage from "./pages/OrderPage";
import SalesReportPage from "./pages/SalesReportPage";
import ProductShowcase from "./components/ProductShowCase";
import PublicStore from "./pages/PublicStore";
import BecomeSeller from "./pages/BecomeSeller/BecomeSellerLanderPage";

function App() {
  const location = useLocation();
  const state = location.state;
  const backgroundLocation = state?.backgroundLocation || location;

  const dispatch = useDispatch();
  const { isUserChecked } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getCartProducts());
    const isCollapsed = localStorage.getItem("isSideBarCollapsed") === "true";
    dispatch(setIsSideBarCollapsed(isCollapsed));
  }, [dispatch]);

  useEffect(() => {
    if (isUserChecked) {
      subscribeUserToPush();
    }
  }, []);

  if (!isUserChecked) return <LoaderModal />;

  return (
    <>
      {/* Toaster config */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#ffffff",
            color: "#1e3a8a",
            padding: "12px 16px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#ffffff",
            },
            style: {
              color: "#1e3a8a",
              background: "#e0f2fe",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              color: "#7f1d1d",
              background: "#fee2e2",
            },
          },
        }}
        containerStyle={{
          top: "3rem",
          zIndex: 9999,
        }}
      />

      {/* Main routes with backgroundLocation */}
      <Routes location={backgroundLocation}>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/google/callback" element={<GoogleCallback />} />

        <Route path="become-seller" element={<BecomeSeller />} />

        {/* App routes inside main layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route
            path="messages"
            element={
              <PrivateRoute>
                <MessagePage />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <SettingLayout />
              </PrivateRoute>
            }
          />
          <Route
            path="stores"
            element={
              <PrivateRoute>
                <Store />
              </PrivateRoute>
            }
          />
          <Route
            path="wishlist"
            element={
              <PrivateRoute>
                <WishList />
              </PrivateRoute>
            }
          />
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="products"
            element={
              <PrivateRoute>
                <ProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="orders"
            element={
              <PrivateRoute>
                <OrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="search"
            element={
              <PrivateRoute>
                <SearchPage />
              </PrivateRoute>
            }
          />
          <Route
            path="sales-report"
            element={
              <PrivateRoute>
                <SalesReportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="become-seller"
            element={
              <PrivateRoute>
                <BecomeSeller />
              </PrivateRoute>
            }
          />

          {/* Non-modal fallback (e.g. direct visit to /product/123) */}
          <Route
            path="product/:productId"
            element={
              <PrivateRoute>
                <ProductShowcase />
              </PrivateRoute>
            }
          />
          <Route path="store/:storeId" element={<PublicStore />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* Modal route only when opened from a background page */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/product/:productId"
            element={
              <PrivateRoute>
                {/* <ProductShowcase isModal={true} product={state?.product} /> */}
                <ProductShowcase isModal={true} />
              </PrivateRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
