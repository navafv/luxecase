import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="bg-dark text-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-serif text-primary font-bold">
                    LuxeCase
                </Link>

                {/* Search (Optional) */}
                <input 
                    type="text" 
                    placeholder="Search boxes..." 
                    className="hidden md:block px-4 py-2 rounded-full text-black focus:outline-none bg-gray-100"
                />

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="relative hover:text-primary transition">
                        <FaShoppingCart size={20} />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
                    </Link>
                    <Link to="/login" className="hover:text-primary transition">
                        <FaUser size={20} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;