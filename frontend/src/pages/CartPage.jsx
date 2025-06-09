import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { removeItem, updateItemQuantity, clearCart } from '../store/slices/cartSlice';
import useAuth from '../hooks/useAuth';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useAuth();
  
  // Xử lý xóa sản phẩm
  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };
  
  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateItemQuantity({ id, quantity }));
  };
  
  // Xử lý xóa giỏ hàng
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };
  
  // Xử lý thanh toán
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };
  
  // Tính phí vận chuyển (sau này sẽ tính dựa trên địa chỉ giao hàng)
  const shippingFee = totalAmount > 100 ? 0 : 10;
  
  // Tính tổng tiền
  const totalPayment = totalAmount + shippingFee;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FaShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Cart Items ({totalQuantity})</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 ml-0 sm:ml-4">
                      <Link to={`/products/${item.id}`} className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                        {item.name}
                      </Link>
                      
                      {/* Price and Quantity Controls */}
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-gray-600 font-medium">
                          ${item.price.toFixed(2)} x {item.quantity} = ${item.totalPrice.toFixed(2)}
                        </div>
                        
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-4 p-1 rounded-md text-red-600 hover:bg-red-50"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <Link to="/products" className="text-indigo-600 hover:text-indigo-500 inline-flex items-center">
                  <FaArrowLeft className="mr-1" />
                  Continue Shopping
                </Link>
                
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-500 inline-flex items-center"
                >
                  <FaTrash className="mr-1" />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 sticky top-4">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                  )}
                </div>
                
                {shippingFee > 0 && (
                  <div className="text-sm text-gray-500">
                    Free shipping on orders over $100
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPayment.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Proceed to Checkout
                </button>
                
                {!isAuthenticated && (
                  <div className="mt-2 text-sm text-gray-500 text-center">
                    You will need to sign in to complete your order
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 