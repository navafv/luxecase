import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    api
      .get("users/addresses/")
      .then((res) => setSavedAddresses(res.data))
      .catch(() => {});
  }, []);

  const fillAddress = (addr) => {
    setFormData({
      full_name: addr.full_name,
      address: `${addr.address_line}, ${addr.state}, ${addr.postal_code}`,
      city: addr.city,
      phone: addr.phone,
    });
    toast.success("Address applied!");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderPayload = {
      ...formData,
      status: "Pending",
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        variations: item.category?.name || "Standard",
      })),
    };

    try {
      await api.post("orders/create/", orderPayload);
      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Order failed:", error.response?.data);
      toast.error(
        error.response?.data?.detail || "Order failed. Check stock or details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return <div className="p-10 text-center">Your cart is empty.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-dark mb-8 text-center">
        Checkout
      </h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

          {savedAddresses.length > 0 && (
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {savedAddresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => fillAddress(addr)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-2 rounded whitespace-nowrap"
                >
                  Use: {addr.city}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="full_name"
                value={formData.full_name}
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <textarea
                name="address"
                value={formData.address}
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
                value={formData.city}
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
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

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
            <span>Estimated Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
