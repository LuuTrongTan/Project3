import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/ui/Spinner';
import { FaFilter, FaSort, FaTimes } from 'react-icons/fa';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, count, totalPages, currentPage } = useSelector((state) => state.product);
  const [showFilters, setShowFilters] = useState(false);
  
  // Lấy các params từ URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  // Xử lý filter
  const [filters, setFilters] = useState({
    category,
    search,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    page,
  });
  
  // Update URL khi filters thay đổi
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters.page > 1) params.set('page', filters.page.toString());
    
    setSearchParams(params);
  }, [filters, setSearchParams]);
  
  // Fetch products khi params thay đổi
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);
  
  // Xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset page khi thay đổi filter
    }));
  };
  
  // Xử lý thay đổi sort
  const handleSortChange = (e) => {
    const { value } = e.target;
    const [newSortBy, newSortOrder] = value.split('-');
    
    setFilters((prev) => ({
      ...prev,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1, // Reset page khi thay đổi sort
    }));
  };
  
  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter đã được cập nhật thông qua onChange
    setShowFilters(false); // Đóng filter trên mobile
  };
  
  // Xử lý reset filter
  const handleResetFilters = () => {
    setFilters({
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    });
  };
  
  // Xử lý thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Danh sách các danh mục (sau này sẽ lấy từ API)
  const categories = [
    { id: 1, name: 'All Categories', value: '' },
    { id: 2, name: 'Electronics', value: 'electronics' },
    { id: 3, name: 'Clothing', value: 'clothing' },
    { id: 4, name: 'Books', value: 'books' },
    { id: 5, name: 'Home & Kitchen', value: 'home-kitchen' },
  ];
  
  // Danh sách các tùy chọn sắp xếp
  const sortOptions = [
    { label: 'Latest', value: 'createdAt-desc' },
    { label: 'Oldest', value: 'createdAt-asc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A-Z', value: 'name-asc' },
    { label: 'Name: Z-A', value: 'name-desc' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {filters.category ? filters.category : 'All Products'}
      </h1>
      
      {/* Filter Mobile Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {showFilters ? (
            <>
              <FaTimes className="mr-2" /> Hide Filters
            </>
          ) : (
            <>
              <FaFilter className="mr-2" /> Show Filters
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filter */}
        <div className={`w-full md:w-64 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                onClick={handleResetFilters}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Reset All
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Search Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              {/* Apply Filters Button (Mobile Only) */}
              <div className="md:hidden">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-sm text-gray-600">
              Showing {products.length} of {count} products
            </div>
            
            <div className="flex items-center">
              <FaSort className="mr-2 text-gray-400" />
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={handleSortChange}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Products List */}
          {loading ? (
            <div className="flex justify-center my-12">
              <Spinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No products found. Try changing your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  First
                </button>
                
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                {[...Array(totalPages).keys()].map((i) => {
                  const pageNumber = i + 1;
                  // Only show current page, first, last, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  
                  // Show ellipsis if there's a gap
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return <span key={pageNumber}>...</span>;
                  }
                  
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
                
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Last
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;