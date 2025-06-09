import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/categories/CategoryCard';
import HeroBanner from '../components/ui/HeroBanner';
import Spinner from '../components/ui/Spinner';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  
  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);
  
  // Dữ liệu categories mẫu (sau này sẽ lấy từ API)
  const categories = [
    { id: 1, name: 'Electronics', image: 'https://via.placeholder.com/300x200?text=Electronics' },
    { id: 2, name: 'Clothing', image: 'https://via.placeholder.com/300x200?text=Clothing' },
    { id: 3, name: 'Books', image: 'https://via.placeholder.com/300x200?text=Books' },
    { id: 4, name: 'Home & Kitchen', image: 'https://via.placeholder.com/300x200?text=Home+Kitchen' },
  ];
  
  // Dữ liệu sale products mẫu (sau này sẽ lấy từ API)
  const saleProducts = products.slice(0, 4).map(product => ({
    ...product,
    discount: Math.floor(Math.random() * 30) + 10, // Discount từ 10-40%
  }));
  
  return (
    <div className="container mx-auto px-4">
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Featured Products */}
      <section className="my-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-500">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
      {/* Categories */}
      <section className="my-12 bg-gray-50 py-12 px-4 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      
      {/* Sale Products */}
      <section className="my-12">
        <div className="bg-red-50 py-6 px-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-red-600">Flash Sale! Up to 40% OFF</h2>
          <p className="text-gray-600">Limited time offer. Grab your favorites now!</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} showDiscount={true} />
          ))}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="my-12 bg-indigo-50 py-12 px-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscribe to Our Newsletter</h2>
        <p className="text-gray-600 mb-6">Get updates on new products and exclusive offers</p>
        
        <div className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-2 rounded-l-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-r-lg hover:bg-indigo-700">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 