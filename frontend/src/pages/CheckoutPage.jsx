import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    city: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Prepare Payload for Django API
    // Match the structure expected by your backend/orders/serializers.py
    const orderPayload = {
      ...formData,
      total_amount: cartTotal, // In a real app, backend should recalc this!
      status: "Pending",
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        variations: item.category?.name || "Standard", // Sending category as variation for MVP
      })),
    };

    try {
      // 2. Send to Backend
      await api.post("orders/create/", orderPayload);

      // 3. Success Handling
      clearCart(); // Empty the cart
      navigate("/order-success"); // Go to success page
    } catch (error) {
      console.error("Order failed:", error.response?.data || error.message);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="p-10 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-dark mb-8 text-center">
        Checkout
      </h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
        {/* Shipping Form */}
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="full_name"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                name="phone"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <textarea
                name="address"
                required
                className="w-full p-2 border rounded"
                rows="3"
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                name="city"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white py-3 rounded mt-4 hover:bg-primary transition disabled:bg-gray-400"
            >
              {loading ? "Processing..." : `Pay ₹${cartTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Mini Order Summary */}
        <div className="md:w-1/2 bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity} x {item.name}
                </span>
                <span className="font-medium">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
