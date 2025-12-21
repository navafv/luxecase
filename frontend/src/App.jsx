import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
          <footer className="bg-dark text-white text-center p-4 mt-8">
            © 2025 LuxeCase. All rights reserved.
          </footer>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
