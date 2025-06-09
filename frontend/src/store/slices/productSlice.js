import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productAPI from '../../api/productAPI';
import { setError, clearError, startLoading, stopLoading } from './uiSlice';

// Thunk action để lấy danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      dispatch(clearError());
      const response = await productAPI.getProducts(params);
      dispatch(stopLoading());
      return response;
    } catch (error) {
      dispatch(stopLoading());
      dispatch(setError(error.response?.data?.error || 'Failed to fetch products'));
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch products' });
    }
  }
);

// Thunk action để lấy chi tiết sản phẩm
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      dispatch(clearError());
      const response = await productAPI.getProductById(productId);
      dispatch(stopLoading());
      return response.product;
    } catch (error) {
      dispatch(stopLoading());
      dispatch(setError(error.response?.data?.error || 'Failed to fetch product details'));
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch product details' });
    }
  }
);

// Initial state
const initialState = {
  products: [],
  product: null,
  count: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

// Product slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.count = action.payload.count;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch products';
      })
      
      // Fetch product by id
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch product details';
      });
  },
});

export const { clearProduct } = productSlice.actions;

export default productSlice.reducer; 