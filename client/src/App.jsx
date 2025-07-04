import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getCurrentUser } from './features/user/userThunks';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import LoaderModal from './components/LoaderModal';
import Login from './pages/Login';
import Register from './pages/Register';
import GoogleCallback from './pages/Oauth-pages/GoogleCallback';

import Dashboard from './pages/Dashboard';
import WishList from './pages/WishList';
import MessagePage from './pages/MessagePage';
import SettingLayout from './pages/Setting/SettingLayout';
import PrivateRoute from './routes/PrivateRoute';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home'
import Store from './pages/Store';
import PageNotFound from './pages/PageNotFound';
import Cart from './pages/Cart';
import { getCartProducts } from './features/cart/cartThunks';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import OrderPage from './pages/OrderPage';

function App() {
  const dispatch = useDispatch();
  const { isUserChecked } = useSelector((state) => state.user);

  React.useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getCartProducts());
  }, [dispatch]);


  if (!isUserChecked) return <LoaderModal />;

  return (
    <>
    <Toaster
      position="top-center"
      toastOptions={{
        // Base styles
        style: {
          borderRadius: '10px',
          background: '#ffffff',
          color: '#1e3a8a', // Tailwind's blue-900
          padding: '12px 16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          fontWeight: 500,
        },
        // Custom styles per type
        success: {
          iconTheme: {
            primary: '#3b82f6', // blue-500
            secondary: '#ffffff',
          },
          style: {
            color: '#1e3a8a',
            background: '#e0f2fe', // blue-100
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444', // red-500
            secondary: '#ffffff',
          },
          style: {
            color: '#7f1d1d',
            background: '#fee2e2', // red-100
          },
        },
      }}
      containerStyle={{
        top: '3rem', // tailwind top-12
        zIndex: 9999,
      }}
    />
    <Router>
      <Routes>
        {/* Public Routes */}
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/google/callback" element={<GoogleCallback />} />

        {/* all pages inside the main layout */}
        <Route  path="/" element={<MainLayout />} >
          <Route index element={<Home />} />
          {/* Protected App Routes */}
          <Route path="messages" element={<PrivateRoute><MessagePage /></PrivateRoute>} />
          <Route path="settings" element={<PrivateRoute><SettingLayout /></PrivateRoute>} />
          <Route path="stores" element={<PrivateRoute><Store /></PrivateRoute>} />
          <Route path="wishlist" element={<PrivateRoute><WishList /></PrivateRoute>} />
          <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="products" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
          <Route path="orders" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
          <Route path="search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />

          {/* Add more pages as needed */}
        </Route>

        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
