import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./apis/authSlice";

export const store = configureStore({
  reducer: {
    authSlice: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
