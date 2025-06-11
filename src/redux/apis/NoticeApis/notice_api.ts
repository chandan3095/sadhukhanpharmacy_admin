import axios from "axios";
import { API_BASE_URL } from "../../../constants/api";
import { Notice } from "../../../interfaces/NoticeInterface";

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

export const noticeApi = {
  getAllNotices: async (): Promise<{ data: Notice[] }> => {
    const response = await axiosInstance.get(`/notice`);
    return response.data;
  },

  getNoticeById: async (id: number): Promise<{ data: Notice }> => {
    const response = await axiosInstance.get(`/notice/${id}`);
    return response.data;
  },

  createNotice: async (
    noticeData: Omit<Notice, "id">
  ): Promise<{ data: Notice }> => {
    const response = await axiosInstance.post(`/notice`, noticeData);
    return response.data;
  },

  updateNotice: async (
    id: number,
    NoticeData: Notice
  ): Promise<{ data: Notice }> => {
    const response = await axiosInstance.put(`/notice/${id}`, NoticeData);
    return response.data;
  },

  deleteNotice: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/notice/${id}`);
    return;
  },
};
