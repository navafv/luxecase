import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-dark text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif text-primary font-bold">
          LuxeCase
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/wishlist" className="hover:text-primary transition">
            <FaHeart size={20} />
          </Link>
          <Link to="/cart" className="relative hover:text-primary transition">
            <FaShoppingCart size={20} />
            {/* Dynamic Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              {/* Make name clickable */}
              <Link
                to="/profile"
                className="text-sm hover:underline font-semibold"
              >
                Hi, {user.name}
              </Link>
              <button onClick={logout} className="text-sm hover:text-red-400">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-primary transition">
              <FaUser size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
