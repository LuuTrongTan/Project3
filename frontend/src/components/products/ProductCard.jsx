import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaShoppingCart, FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { addItem } from '../../store/slices/cartSlice';

const ProductCard = ({ product, showDiscount = false }) => {
  const dispatch = useDispatch();
  
  // Kiểm tra nếu product có thể là undefined hoặc null
  if (!product) return null;
  
  // Giá sau khi giảm giá
  const discountedPrice = showDiscount && product.discount
    ? (product.price - (product.price * product.discount / 100)).toFixed(2)
    : null;
  
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: discountedPrice ? parseFloat(discountedPrice) : product.price,
      image: product.image,
      quantity: 1
    }));
  };
  
  // Render stars dựa vào rating
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };
  
  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md">
        {/* Badge khuyến mãi */}
        {showDiscount && product.discount && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-10">
            -{product.discount}%
          </div>
        )}
        
        {/* Ảnh sản phẩm */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Buttons overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-white text-gray-800 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
              title="Add to cart"
            >
              <FaShoppingCart className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white transition-colors duration-300"
              title="Add to wishlist"
            >
              <FaHeart className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Thông tin sản phẩm */}
        <div className="p-4">
          {/* Tên và danh mục */}
          <div className="mb-2">
            <h3 className="text-lg font-medium text-gray-800 line-clamp-1 group-hover:text-indigo-600">
              {product.name}
            </h3>
            {product.category && (
              <p className="text-sm text-gray-500">{product.category}</p>
            )}
          </div>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex mr-1">
                {renderRatingStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews || 0})
              </span>
            </div>
          )}
          
          {/* Giá */}
          <div className="flex items-center">
            {discountedPrice ? (
              <>
                <span className="text-lg font-bold text-gray-800">${discountedPrice}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 