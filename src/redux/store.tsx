import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./apis/authSlice";
import doctorReducer from "./apis/DoctorSlices/doctorSlice";

export const store = configureStore({
  reducer: {
    authSlice: authReducer,
    doctorSlice: doctorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
