import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";
import {
  toggleCreateProductModal,
  toggleUpdateProductModal,
} from "./extraSlice";

const messageFrom = (error, fallback) =>
  error?.response?.data?.message || fallback;

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    fetchingProducts: false,
    products: [],
    totalProducts: 0,
  },
  reducers: {
    createProductRequest(state) {
      state.loading = true;
    },
    createProductSuccess(state, action) {
      state.loading = false;
      if (action.payload) state.products = [action.payload, ...state.products];
      state.totalProducts += 1;
    },
    createProductFailed(state) {
      state.loading = false;
    },
    getAllProductsRequest(state) {
      state.fetchingProducts = true;
    },
    getAllProductsSuccess(state, action) {
      state.fetchingProducts = false;
      state.products = action.payload.products ?? [];
      state.totalProducts = action.payload.totalProducts ?? 0;
    },
    getAllProductsFailed(state) {
      state.fetchingProducts = false;
    },
    updateProductRequest(state) {
      state.loading = true;
    },
    updateProductSuccess(state, action) {
      state.loading = false;
      if (!action.payload) return;
      state.products = state.products.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
    },
    updateProductFailed(state) {
      state.loading = false;
    },
    deleteProductRequest(state) {
      state.loading = true;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      state.totalProducts = Math.max(0, state.totalProducts - 1);
    },
    deleteProductFailed(state) {
      state.loading = false;
    },
  },
});

const actions = productSlice.actions;

export const createNewProduct = (data) => async (dispatch) => {
  dispatch(actions.createProductRequest());
  try {
    const res = await axiosInstance.post("/product/admin/create", data);
    dispatch(actions.createProductSuccess(res.data.product));
    toast.success(res.data.message || "Product created.");
    dispatch(toggleCreateProductModal());
  } catch (error) {
    dispatch(actions.createProductFailed());
    toast.error(messageFrom(error, "Could not create the product."));
  }
};

export const fetchAllProducts = (page) => async (dispatch) => {
  dispatch(actions.getAllProductsRequest());
  try {
    const res = await axiosInstance.get(`/product?page=${page || 1}`);
    dispatch(actions.getAllProductsSuccess(res.data));
  } catch {
    dispatch(actions.getAllProductsFailed());
  }
};

export const updateProduct = (data, id) => async (dispatch) => {
  dispatch(actions.updateProductRequest());
  try {
    const res = await axiosInstance.put(`/product/admin/update/${id}`, data);
    dispatch(actions.updateProductSuccess(res.data.updatedProduct));
    toast.success(res.data.message || "Product updated.");
    dispatch(toggleUpdateProductModal());
  } catch (error) {
    dispatch(actions.updateProductFailed());
    toast.error(messageFrom(error, "Could not update the product."));
  }
};

export const deleteProduct = (id, page) => async (dispatch, getState) => {
  dispatch(actions.deleteProductRequest());
  try {
    const res = await axiosInstance.delete(`/product/admin/delete/${id}`);
    dispatch(actions.deleteProductSuccess(id));
    toast.success(res.data.message || "Product deleted.");

    const { totalProducts } = getState().product;
    const maxPage = Math.ceil(totalProducts / 10) || 1;
    dispatch(fetchAllProducts(Math.min(page, maxPage)));
  } catch (error) {
    dispatch(actions.deleteProductFailed());
    toast.error(messageFrom(error, "Could not delete the product."));
  }
};

export default productSlice.reducer;
