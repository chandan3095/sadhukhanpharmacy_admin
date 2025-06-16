import axios from "axios";
import { API_BASE_URL } from "../../../constants/api";
import { Product } from "../../../interfaces/ProductInterface";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const productApi = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products`);
    return response.data.data;
  },

  getProductById: async (id: number): Promise<{ data: Product }> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: Product): Promise<{ data: Product }> => {
    const response = await axiosInstance.post(`/products`, productData);
    return response.data;
  },

  updateProduct: async (
    id: number,
    productData: Product
  ): Promise<{ data: Product }> => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
    return;
  },
};
