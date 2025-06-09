import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShareAlt } from 'react-icons/fa';
import { fetchProductById, clearProduct } from '../store/slices/productSlice';
import { addItem } from '../store/slices/cartSlice';
import Spinner from '../components/ui/Spinner';
import ProductCard from '../components/products/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, products, loading } = useSelector((state) => state.product);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  // Fetch product khi component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    
    // Cleanup khi component unmount
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);
  
  // Nếu đang loading, hiển thị spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Nếu không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }
  
  // Xử lý tăng/giảm số lượng
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= (product.stock || 10)) {
      setQuantity(newQuantity);
    }
  };
  
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images ? product.images[0] : product.image,
      quantity
    }));
  };
  
  // Xử lý mua ngay
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
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
  
  // Related products (chỉ là ví dụ, sau này sẽ lấy từ API)
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6 text-sm">
        <Link to="/" className="text-gray-500 hover:text-indigo-600">Home</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to="/products" className="text-gray-500 hover:text-indigo-600">Products</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>
      
      {/* Product Detail */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-4">
            <img
              src={product.images ? product.images[selectedImage] : product.image || 'https://via.placeholder.com/600x600?text=No+Image'}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`border rounded-md overflow-hidden ${
                    selectedImage === index ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} - ${index + 1}`} className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderRatingStars(product.rating || 0)}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews || 0} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="text-2xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          {/* Short Description */}
          <p className="text-gray-600 mb-6">
            {product.shortDescription || product.description?.substring(0, 150) + '...' || 'No description available.'}
          </p>
          
          {/* Availability */}
          <div className="mb-6">
            <span className="text-sm font-medium text-gray-700">Availability: </span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">In Stock ({product.stock} items)</span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock || 10)))}
                className="w-16 text-center border-t border-b border-gray-300 py-2 focus:outline-none"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
          
          {/* Extra Actions */}
          <div className="flex items-center space-x-4 text-sm mb-8">
            <button className="flex items-center text-gray-500 hover:text-red-500">
              <FaHeart className="mr-1" />
              <span>Add to Wishlist</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-indigo-500">
              <FaShareAlt className="mr-1" />
              <span>Share</span>
            </button>
          </div>
          
          {/* Categories & Tags */}
          {product.category && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Category: </span>
              <Link to={`/products?category=${product.category}`} className="text-indigo-600 hover:text-indigo-500">
                {product.category}
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specification')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'specification'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({product.reviews || 0})
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>{product.description || 'No description available.'}</p>
            </div>
          )}
          
          {activeTab === 'specification' && (
            <div className="prose max-w-none">
              {product.specifications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 pb-2">
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No specifications available.</p>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              {product.reviews && product.reviews > 0 ? (
                <p>Reviews will be shown here.</p>
              ) : (
                <p>No reviews available for this product.</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;