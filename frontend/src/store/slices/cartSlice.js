import { createSlice } from '@reduxjs/toolkit';

// Lấy giỏ hàng từ local storage
const getStoredCart = () => {
  const cart = localStorage.getItem('cart');
  if (cart) {
    try {
      return JSON.parse(cart);
    } catch (error) {
      localStorage.removeItem('cart');
      return { items: [], totalQuantity: 0, totalAmount: 0 };
    }
  }
  return { items: [], totalQuantity: 0, totalAmount: 0 };
};

const initialState = {
  ...getStoredCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
          totalPrice: newItem.price * (newItem.quantity || 1)
        });
      }
      
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      
      // Lưu vào localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      
      // Lưu vào localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
        
        // Lưu vào localStorage
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      // Xóa khỏi localStorage
      localStorage.removeItem('cart');
    }
  }
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 