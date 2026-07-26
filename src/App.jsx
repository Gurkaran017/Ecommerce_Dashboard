import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "./contexts/ThemeContext";
import { useTheme } from "./contexts/theme-context";
import AdminLayout from "./components/layout/AdminLayout";

import Overview from "./pages/Overview";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { getUser } from "./store/slices/authSlice";
import { getDashboardStats } from "./store/slices/adminSlice";

const Toasts = () => {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar
      closeButton={false}
      theme={theme}
      toastClassName="!rounded-none !border !border-line !bg-surface !text-ink !font-sans !text-sm"
    />
  );
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) dispatch(getDashboardStats());
  }, [isAuthenticated, dispatch]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />

          {/* Every admin section is a real, linkable, refreshable URL. */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toasts />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
