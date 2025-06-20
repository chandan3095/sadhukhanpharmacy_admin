import axios from "axios";
import { API_BASE_URL } from "../../../constants/api";
import { DoctorVisitingDays } from "../../../interfaces/DoctorInterface";

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

export const visitingDaysApi = {
  getAllVisitingDays: async (): Promise<DoctorVisitingDays[]> => {
    const response = await axiosInstance.get(`/doctor-visiting-days`);
    return response.data.data;
  },

  getVisitingDaysByDay: async (
    day: string
  ): Promise<{ data: DoctorVisitingDays[] }> => {
    const response = await axiosInstance.get(
      `/doctor-visiting-days/?day=${day}`
    );
    return response.data;
  },

  createVisitingDays: async (
    doctorData: DoctorVisitingDays
  ): Promise<{ data: DoctorVisitingDays }> => {
    const response = await axiosInstance.post(
      `/doctor-visiting-days`,
      doctorData
    );
    return response.data;
  },

  updateVisitingDays: async (
    id: string,
    doctorData: Partial<DoctorVisitingDays>
  ): Promise<{ data: DoctorVisitingDays }> => {
    const response = await axiosInstance.put(
      `/doctor-visiting-days/${id}`,
      doctorData
    );
    return response.data;
  },

  deleteVisitingDays: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/doctor-visiting-days/${id}`);
    return;
  },
};
