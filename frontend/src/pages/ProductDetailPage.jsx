import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaStar, FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    api
      .get(`products/${slug}/`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleWishlist = async () => {
    if (!user) return toast.error("Please login first");
    try {
      const res = await api.post(`products/wishlist/${product.id}/`);
      toast.success(
        res.data.status === "added"
          ? "Added to Wishlist"
          : "Removed from Wishlist"
      );
    } catch {
      toast.error("Error updating wishlist");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login to review");
    try {
      await api.post(`products/${product.id}/review/`, { rating, comment });
      toast.success("Review submitted!");
      // Reload product to see new review
      const res = await api.get(`products/${slug}/`);
      setProduct(res.data);
    } catch (err) {
      toast.error(err.response?.data?.[0] || "Failed to submit review");
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Gallery */}
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-lg mb-4"
          />
          <div className="grid grid-cols-4 gap-2">
            {product.gallery?.map((img) => (
              <img
                key={img.id}
                src={img.image}
                className="rounded cursor-pointer border hover:border-primary"
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-serif text-dark">{product.name}</h1>
          <div className="flex items-center mt-2 mb-4">
            <span className="text-yellow-500 flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </span>
            <span className="text-gray-500">
              ({product.reviews.length} reviews)
            </span>
          </div>
          <p className="text-2xl font-bold text-primary mb-4">
            ₹{product.price}
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-dark text-white py-3 rounded-lg hover:bg-primary transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-red-500"
            >
              <FaHeart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-serif mb-6">Customer Reviews</h2>

        {/* Review Form */}
        {user && (
          <form onSubmit={submitReview} className="mb-8 border-b pb-8">
            <h3 className="font-semibold mb-3">Write a Review</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <textarea
              className="w-full p-3 border rounded mb-3"
              rows="3"
              placeholder="How was your experience?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
            <button className="bg-primary text-white px-6 py-2 rounded">
              Submit
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {product.reviews.map((rev) => (
            <div key={rev.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">
                  {rev.user_name || "Anonymous"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex text-yellow-400 text-sm mb-2">
                {[...Array(rev.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-700">{rev.comment}</p>
            </div>
          ))}
          {product.reviews.length === 0 && (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
