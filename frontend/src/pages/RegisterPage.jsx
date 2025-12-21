import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch {
      setError("Registration failed. Email might be taken.");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-serif text-center text-dark mb-6">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                name="first_name"
                type="text"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                name="last_name"
                type="text"
                required
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              name="phone_number"
              type="text"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-dark text-white py-2 rounded hover:bg-primary transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
