import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link to={`/product/${product.slug}`}>
                {/* Handle case where image might be null or a full URL */}
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover"
                />
            </Link>
            <div className="p-4">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category?.name}
                </span>
                <Link to={`/product/${product.slug}`}>
                    <h3 className="text-lg font-semibold mt-1 hover:text-primary truncate">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-primary font-bold text-xl">
                        ₹{product.price}
                    </span>
                    <button className="bg-dark text-white px-3 py-1 rounded text-sm hover:bg-primary transition cursor-pointer">
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;