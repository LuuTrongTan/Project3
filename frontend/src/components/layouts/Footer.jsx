import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">E-Shop</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop shop for all your shopping needs. We provide quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-indigo-400" />
                <span className="text-gray-300">123 Shop Street, City, Country</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-indigo-400" />
                <span className="text-gray-300">+1 234 567 890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-indigo-400" />
                <span className="text-gray-300">info@eshop.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-300 text-center">
            &copy; {currentYear} E-Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 