import React from "react";
import { Routes, Route } from "react-router-dom";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
} from "./pages";


import UpdatePassword from "./pages/UpdatePassword";
import OrderDetailsSheet from "./pages/OrderDetailsSheet";
import TermsandConditions from "./pages/TermsandConditions";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import CancelledOrderPage from "./pages/CancelledOrderPage";
import PaymentsPage from "./pages/PaymentsPage";
import ForgotPassword from "./pages/ForgotPassword";
import CronJob from "./pages/CronJob";
import NotificationPage from "./pages/NotificationPage";
import NotificationSettings from "./pages/NotificationSetting";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const RoutesComponent = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cronjob" element={<CronJob />} />
    <Route path="/shop" element={<Products />} />
    <Route path="/product/:id" element={<Product />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/update-password" element={<UpdatePassword />} />
    <Route path="/order-details" element={<OrderDetailsSheet />} />
    <Route path="/terms" element={<TermsandConditions />} />
    <Route path="/notification" element={<NotificationPage />} />
    <Route
      path="/orders/:orderId"
      element={
        <ProtectedRoute>
          <OrderDetailsPage />
        </ProtectedRoute>
      }
    />
    <Route path="/payments" element={<PaymentsPage />} />
    <Route path="/notification" element={<NotificationSettings />} />
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      }
    />
    <Route
      path="/return-cancel"
      element={
        <ProtectedRoute>
          <CancelledOrderPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/order"
      element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route path="/register" element={<Register />} />
    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<PageNotFound />} />
    <Route path="/product/*" element={<PageNotFound />} />
  </Routes>
);

export default RoutesComponent;
