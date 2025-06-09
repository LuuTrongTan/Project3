import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { logout } from '../../store/slices/authSlice';
import { toggleNavbar, closeNavbar } from '../../store/slices/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { navbarOpen } = useSelector((state) => state.ui);
  const [searchInput, setSearchInput] = useState('');
  
  // Đóng navbar khi chuyển trang
  useEffect(() => {
    dispatch(closeNavbar());
  }, [dispatch, navigate]);
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo và menu chính */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                E-Shop
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/products" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Products
              </Link>
              <Link to="/about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </Link>
              <Link to="/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          
          {/* Thanh tìm kiếm */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search products..."
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </form>
            </div>
          </div>
          
          {/* Actions bên phải */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* Cart icon */}
            <Link to="/cart" className="relative p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none">
              <FaShoppingCart className="h-6 w-6" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>
            
            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div className="flex items-center">
                  <div className="text-sm text-gray-700 mr-2 hidden md:block">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                  >
                    <FaSignOutAlt className="h-6 w-6" />
                  </button>
                  <Link to="/profile" className="p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none">
                    <FaUserCircle className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => dispatch(toggleNavbar())}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {navbarOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${navbarOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => dispatch(closeNavbar())}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => dispatch(closeNavbar())}
          >
            Products
          </Link>
          <Link
            to="/about"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => dispatch(closeNavbar())}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => dispatch(closeNavbar())}
          >
            Contact
          </Link>
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <FaUserCircle className="h-10 w-10 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
              <div className="ml-auto flex space-x-3">
                <Link
                  to="/cart"
                  className="flex-shrink-0 relative p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={() => dispatch(closeNavbar())}
                >
                  <FaShoppingCart className="h-6 w-6" />
                  {totalQuantity > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 p-1 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <FaSignOutAlt className="h-6 w-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 px-4">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => dispatch(closeNavbar())}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => dispatch(closeNavbar())}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 