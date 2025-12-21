import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const ProductForm = () => {
  const { slug } = useParams(); // If slug exists, we are in "Edit" mode
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    is_available: true,
    image: null, // File object
  });
  const [previewImage, setPreviewImage] = useState(null);

  // 1. Fetch Data on Load
  useEffect(() => {
    // Fetch Categories for the dropdown
    api.get("products/categories/").then((res) => setCategories(res.data));

    // If Editing, fetch existing product data
    if (slug) {
      api.get(`products/${slug}/`).then((res) => {
        const p = res.data;
        setFormData({
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          category: p.category.id, // We need ID for sending back
          is_available: p.is_available,
          image: null, // Don't prepopulate file input, it's insecure
        });
        setPreviewImage(p.image); // Show current image
      });
    }
  }, [slug]);

  // 2. Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0])); // Show preview immediately
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 3. Submit Form (The tricky part: Multipart Form Data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // We must use FormData object for file uploads
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category); // Expects ID
    data.append("is_available", formData.is_available);

    // Only append image if a new one was selected
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      if (slug) {
        // Update (PUT)
        await api.patch(`products/${slug}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product Updated!");
      } else {
        // Create (POST)
        await api.post("products/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product Created!");
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("Save failed", error.response?.data);
      alert("Failed to save product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-serif mb-6">
        {slug ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-bold mb-2">Product Image</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover mb-2 rounded border"
            />
          )}
          <input
            type="file"
            onChange={handleChange}
            className="w-full"
            accept="image/*"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-bold">Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Stock & Active */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold">Stock Quantity</label>
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-center mt-6">
            <input
              name="is_available"
              type="checkbox"
              checked={formData.is_available}
              onChange={handleChange}
              className="mr-2 h-5 w-5"
            />
            <label className="text-sm font-bold">Available for Sale</label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-dark text-white py-3 rounded hover:bg-primary transition"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
