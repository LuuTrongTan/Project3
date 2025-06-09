import axiosInstance from './axiosInstance';

const productAPI = {
  // Lấy danh sách sản phẩm
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams();
    
    if (params.page) queryString.append('page', params.page);
    if (params.limit) queryString.append('limit', params.limit);
    if (params.search) queryString.append('search', params.search);
    if (params.category) queryString.append('category', params.category);
    if (params.minPrice) queryString.append('minPrice', params.minPrice);
    if (params.maxPrice) queryString.append('maxPrice', params.maxPrice);
    if (params.sortBy) queryString.append('sortBy', params.sortBy);
    if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);
    
    const query = queryString.toString();
    return await axiosInstance.get(`/products${query ? `?${query}` : ''}`);
  },
  
  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (productId) => {
    return await axiosInstance.get(`/products/${productId}`);
  },
  
  // Lấy đánh giá của sản phẩm
  getProductReviews: async (productId) => {
    return await axiosInstance.get(`/reviews/product/${productId}`);
  },
  
  // Thêm đánh giá sản phẩm (yêu cầu đăng nhập)
  addProductReview: async (productId, reviewData) => {
    return await axiosInstance.post(`/products/${productId}/reviews`, reviewData);
  }
};

export default productAPI; 