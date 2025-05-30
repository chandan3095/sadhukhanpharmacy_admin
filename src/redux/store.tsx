import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import doctorReducer from "./slices/DoctorSlices/doctorSlice";

export const store = configureStore({
  reducer: {
    authSlice: authReducer,
    doctorSlice: doctorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
