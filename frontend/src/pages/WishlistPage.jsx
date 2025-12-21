import { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("products/wishlist/")
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-dark mb-8 text-center">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="text-primary underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;