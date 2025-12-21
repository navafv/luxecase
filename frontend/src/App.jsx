import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductForm from "./pages/admin/ProductForm";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Navbar />
                  <CartPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <LoginPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <RegisterPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/checkout"
              element={
                <>
                  <Navbar />
                  <CheckoutPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/order-success"
              element={
                <>
                  <Navbar />
                  <OrderSuccessPage />
                  <Footer />
                </>
              }
            />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<ProductForm />} />
                <Route path="products/edit/:slug" element={<ProductForm />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

const Footer = () => (
  <footer className="bg-dark text-white text-center p-4 mt-8">
    © 2024 LuxeCase. All rights reserved.
  </footer>
);

export default App;
