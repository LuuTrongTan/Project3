import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // Kiểm tra nếu category có thể là undefined hoặc null
  if (!category) return null;
  
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="block group"
    >
      <div className="relative rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        {/* Background Image */}
        <div className="h-40 relative overflow-hidden">
          <img
            src={category.image || 'https://via.placeholder.com/300x200?text=Category'}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          
          {/* Category Name */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-xl font-bold text-white text-center px-4 py-2 rounded bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
              {category.name}
            </h3>
          </div>
        </div>
        
        {/* Products Count */}
        {category.productCount && (
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-800">
            {category.productCount} Products
          </div>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard; 