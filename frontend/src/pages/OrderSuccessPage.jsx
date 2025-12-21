import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccessPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />
      <h1 className="text-4xl font-serif text-dark mb-2">Thank You!</h1>
      <p className="text-gray-600 text-lg mb-8">
        Your order has been placed successfully.
      </p>
      <Link
        to="/"
        className="bg-dark text-white px-6 py-3 rounded-full hover:bg-primary transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccessPage;
