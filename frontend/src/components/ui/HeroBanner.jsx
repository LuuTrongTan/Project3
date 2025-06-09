import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="relative bg-gray-900 overflow-hidden rounded-lg my-6">
      <div className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 h-96 flex items-center">
        <div className="text-center md:text-left md:max-w-lg z-10">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            Summer Collection
            <span className="block text-indigo-400">2023</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto md:mx-0 text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl">
            Discover our latest collection with styles perfect for summer. Get up to 40% off on selected items.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link
              to="/products"
              className="rounded-md shadow px-8 py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Shop Now
            </Link>
            <Link
              to="/products?category=new-arrivals"
              className="rounded-md px-8 py-3 bg-gray-800 text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
      
      {/* Overlay image */}
      <div className="absolute inset-0 w-full h-full object-cover">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt="Summer Collection"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default HeroBanner; 