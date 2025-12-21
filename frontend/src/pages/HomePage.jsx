import { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category__slug") || "";
  const searchTerm = searchParams.get("search") || "";

  // Fetch Categories
  useEffect(() => {
    api.get("products/categories/").then((res) => setCategories(res.data));
  }, []);

  // Fetch Products with Filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (currentCategory) params.append("category__slug", currentCategory);
    if (searchTerm) params.append("search", searchTerm);

    api
      .get(`products/?${params.toString()}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentCategory, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.search.value;
    setSearchParams({
      search: term,
      ...(currentCategory ? { category__slug: currentCategory } : {}),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              !currentCategory
                ? "bg-primary text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ category__slug: cat.slug })}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                currentCategory === cat.slug
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <input
            name="search"
            type="text"
            placeholder="Search..."
            defaultValue={searchTerm}
            className="px-4 py-2 border rounded-l-lg focus:outline-none focus:border-primary w-full"
          />
          <button
            type="submit"
            className="bg-dark text-white px-4 rounded-r-lg hover:bg-primary transition"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
