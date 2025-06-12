import axios from "axios";
import { API_BASE_URL } from "../../../constants/api";
import { DoctorDetails } from "../../../interfaces/DoctorInterface";

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

export const doctorsApi = {
  getAllDoctors: async (): Promise<DoctorDetails[]> => {
    const response = await axiosInstance.get(`/doctors`);
    return response.data.data;
  },

  getDoctorById: async (id: number): Promise<{ data: DoctorDetails }> => {
    const response = await axiosInstance.get(`/doctors/${id}`);
    return response.data;
  },

  createDoctor: async (
    doctorData: DoctorDetails
  ): Promise<{ data: DoctorDetails }> => {
    const response = await axiosInstance.post(`/doctors`, doctorData);
    return response.data;
  },

  updateDoctor: async (
    id: number,
    doctorData: Partial<DoctorDetails>
  ): Promise<{ data: DoctorDetails }> => {
    const response = await axiosInstance.put(`/doctors/${id}`, doctorData);
    return response.data;
  },

  deleteDoctor: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/doctors/${id}`);
    return;
  },
};
