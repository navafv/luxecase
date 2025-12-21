import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("products/").then((res) => setProducts(res.data));
  }, []);

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`products/${slug}/`);
      setProducts(products.filter((p) => p.slug !== slug));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-dark">Inventory</h1>
        {/* Update the Button to be a Link */}
        <Link
          to="/admin/products/add"
          className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div className="flex items-center">
              <img
                src={product.image}
                alt=""
                className="w-12 h-12 rounded object-cover mr-4"
              />
              <div>
                {/* Make Title Clickable to Edit */}
                <Link
                  to={`/admin/products/edit/${product.slug}`}
                  className="font-bold hover:text-primary hover:underline"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            </div>
            <div className="space-x-2">
              {/* Add Edit Icon/Button */}
              <Link
                to={`/admin/products/edit/${product.slug}`}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(product.slug)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
