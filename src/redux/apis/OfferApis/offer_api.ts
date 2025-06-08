import axios from "axios";
import { API_BASE_URL } from "../../../constants/api";
import { Offer } from "../../../interfaces/OfferInterface";

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

export const offerApi = {
  getAllOffers: async (): Promise<{ data: Offer[] }> => {
    const response = await axiosInstance.get(`/offers`);
    return response.data;
  },

  getOfferById: async (id: number): Promise<{ data: Offer }> => {
    const response = await axiosInstance.get(`/offers/${id}`);
    return response.data;
  },

  createOffer: async (offerData: Offer): Promise<{ data: Offer }> => {
    const response = await axiosInstance.post(`/offers`, offerData);
    return response.data;
  },

  updateOffer: async (
    id: number,
    offerData: Offer
  ): Promise<{ data: Offer }> => {
    const response = await axiosInstance.put(`/offers/${id}`, offerData);
    return response.data;
  },

  deleteOffer: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/offers/${id}`);
    return;
  },
};
