/* eslint-disable @typescript-eslint/no-explicit-any */
import { Doctor } from "../../../interfaces/DoctorInterface";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { doctorsApi } from "./doctor_api";

export const fetchDoctors = createAsyncThunk<
  Doctor[],
  void,
  { rejectValue: string }
>("doctors/fetchDoctors", async (_, { rejectWithValue }) => {
  try {
    const doctors = await doctorsApi.getAllDoctors();
    return doctors;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch doctors.";
    return rejectWithValue(errorMessage);
  }
});

export const fetchDoctorById = createAsyncThunk<
  Doctor,
  number,
  { rejectValue: string }
>("doctors/fetchDoctorById", async (id, { rejectWithValue }) => {
  try {
    const doctor = await doctorsApi.getDoctorById(id);
    return doctor.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch Selected doctor.";
    return rejectWithValue(errorMessage);
  }
});

export const createDoctor = createAsyncThunk<
  Doctor,
  Doctor,
  { rejectValue: string }
>("doctors/createDoctor", async (doctorData, { rejectWithValue }) => {
  try {
    const newDoctor = await doctorsApi.createDoctor(doctorData);
    return newDoctor.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create doctor.";
    return rejectWithValue(errorMessage);
  }
});

export const updateDoctor = createAsyncThunk<
  Doctor,
  { id: number; doctorData: Partial<Doctor> },
  { rejectValue: string }
>("doctors/updateDoctor", async ({ id, doctorData }, { rejectWithValue }) => {
  try {
    const updatedDoctor = await doctorsApi.updateDoctor(id, doctorData);
    return updatedDoctor.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update doctor.";
    return rejectWithValue(errorMessage);
  }
});

export const deleteDoctor = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("doctors/deleteDoctor", async (id, { rejectWithValue }) => {
  try {
    await doctorsApi.deleteDoctor(id);
    return id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete doctor.";
    return rejectWithValue(errorMessage);
  }
});

const initialState: {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
} = {
  doctors: [],
  selectedDoctor: null,
  status: "idle",
  error: null,
};

const doctorSlice = createSlice({
  name: "doctorSlice",
  initialState,
  reducers: {
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchDoctors.fulfilled,
        (state, action: PayloadAction<Doctor[]>) => {
          state.status = "succeeded";
          state.doctors = action.payload;
        }
      )
      .addCase(
        fetchDoctors.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      )
      // Fetch Doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchDoctorById.fulfilled,
        (state, action: PayloadAction<Doctor>) => {
          state.status = "succeeded";
          state.selectedDoctor = action.payload;
        }
      )
      .addCase(
        fetchDoctorById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      )

      // Create Doctor
      .addCase(createDoctor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createDoctor.fulfilled,
        (state, action: PayloadAction<Doctor>) => {
          state.status = "succeeded";
          state.doctors.push(action.payload);
        }
      )
      .addCase(
        createDoctor.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      )

      // Update Doctor
      .addCase(updateDoctor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateDoctor.fulfilled,
        (state, action: PayloadAction<Doctor>) => {
          state.status = "succeeded";
          const index = state.doctors.findIndex(
            (doc) => doc.id === action.payload.id
          );
          if (index !== -1) {
            state.doctors[index] = action.payload;
          }
        }
      )
      .addCase(
        updateDoctor.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      )

      // Delete Doctor
      .addCase(deleteDoctor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteDoctor.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = "succeeded";
          state.doctors = state.doctors.filter(
            (doc) => doc.id !== action.payload
          );
        }
      )
      .addCase(
        deleteDoctor.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error = action.payload || "An unknown error occurred.";
        }
      );
  },
});

export const { clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
