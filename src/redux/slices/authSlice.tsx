import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoginCredentials } from "../../interfaces/LoginCredentialsInterface";
import { LoginResponse, User } from "../../interfaces/LoginResponseInterface";
import { API_BASE_URL } from "../../constants/api";

const initialState: {
  token: string | null;
  user: User | null;
  roles: string[];
  permissions: string[];
  username: string | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
} = {
  token: null,
  user: null,
  roles: [],
  permissions: [],
  username: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

export const setCredentials = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Login failed: Unknown error"
      );
    }
    const data = await response.json();

    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    localStorage.setItem("userRole", JSON.stringify(data.roles));

    return data;
  } catch (error) {
    console.error("Login API call failed:", error);
    return rejectWithValue("Network error or server is unreachable.");
  }
});

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.roles = [];
      state.permissions = [];
      state.username = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
    },

    reHydrateAuth: (state) => {
      const token = localStorage.getItem("userToken");
      const userData = localStorage.getItem("userData");
      const userRole = localStorage.getItem("userRole");

      if (token && userData && userRole) {
        state.token = token;
        state.user = JSON.parse(userData);
        state.roles = JSON.parse(userRole);
        state.permissions = state.permissions || [];
        state.username = state.user?.username || null;
        state.isAuthenticated = true;
        state.status = "succeeded";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCredentials.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        setCredentials.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "succeeded";
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.roles = action.payload.roles;
          state.permissions = action.payload.permissions;
          state.user = action.payload.user;
          state.username = action.payload.user.username;
          state.error = null;
        }
      )
      .addCase(setCredentials.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message || "Something went wrong";
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.roles = [];
        state.permissions = [];
        state.username = null;
      });
  },
});

export const { logout, reHydrateAuth } = authSlice.actions;

export default authSlice.reducer;
