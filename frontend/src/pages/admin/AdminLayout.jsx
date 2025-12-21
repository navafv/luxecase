import { Link, Outlet } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col">
        <div className="p-6 text-2xl font-serif text-primary font-bold border-b border-gray-700">
          Luxe Admin
        </div>
        <nav className="grow p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center p-3 hover:bg-gray-800 rounded transition"
          >
            <FaClipboardList className="mr-3" /> Orders
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center p-3 hover:bg-gray-800 rounded transition"
          >
            <FaBoxOpen className="mr-3" /> Products
          </Link>
        </nav>
        <button
          onClick={logout}
          className="p-4 flex items-center hover:bg-red-600 transition text-left"
        >
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="grow p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
