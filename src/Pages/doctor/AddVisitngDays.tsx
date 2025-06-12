/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useEffect, useState } from "react";
import {
  DoctorDetails,
  DoctorVisitingDays,
} from "../../interfaces/DoctorInterface";
import { doctorsApi } from "../../redux/apis/DoctorSlices/doctor_api";
import { visitingDaysApi } from "../../redux/apis/DoctorSlices/visitingDays_api";
import { format } from "date-fns";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/ToastMessage";

const AddVisitingDays = () => {
  const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [formData, setFormData] = useState({
    doctorId: "" as number | "",
    day: "",
    fromTime: null as Date | null,
    toTime: null as Date | null,
  });

  const [doctorsList, setDoctorsList] = useState<DoctorDetails[]>([]);

  useEffect(() => {
    getDoctors();
  }, []);

  const getDoctors = async () => {
    const response = await doctorsApi.getAllDoctors();
    setDoctorsList(response);
  };

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSelectChange =
    (key: "doctor" | "day") => (event: SelectChangeEvent<any>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [key === "doctor" ? "doctorId" : "day"]:
          key === "doctor" ? Number(value) : value,
      }));
    };

  const handleTimeChange = (key: "fromTime" | "toTime", value: Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setStatus("loading");

      const VisitingDaysData: DoctorVisitingDays = {
        doctor_id: formData.doctorId.toString(),
        day: formData.day,
        start_time: formData.fromTime ? format(formData.fromTime, "HH:mm") : "",
        end_time: formData.toTime ? format(formData.toTime, "HH:mm") : "",
      };

      await visitingDaysApi.createVisitingDays(VisitingDaysData);
      setStatus("success");
      showSuccessToast("Doctor Visiting Day Added Successfully!");
    } catch (error) {
      console.error("Error adding doctor:", error);
      setStatus("error");
      showErrorToast("Failed!");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ padding: 3 }}>
        {/* Header */}
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          color="secondary"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "2.25rem",
            },
          }}
        >
          Add Doctor Visiting Days
        </Typography>

        {/* Breadcrumbs */}
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/">
            Dashboard
          </Link>
          <Typography color="text.secondary">Add Visiting Days</Typography>
        </Breadcrumbs>

        {/* Loader */}
        {status === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: 4,
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "600px", // Make it responsive
          }}
        >
          {/* Doctor Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={formData.doctorId === "" ? undefined : formData.doctorId}
              onChange={handleSelectChange("doctor")}
              input={<OutlinedInput label="Select Doctor" />}
            >
              {Array.isArray(doctorsList) &&
                doctorsList.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Day Dropdown (Single Select) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Day</InputLabel>
            <Select
              value={formData.day}
              onChange={handleSelectChange("day")}
              input={<OutlinedInput label="Select Day" />}
            >
              {daysList.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Time Pickers */}
          <Box
            display="flex"
            gap={2}
            marginY={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <TimePicker
              label="From"
              value={formData.fromTime}
              onChange={(value) => handleTimeChange("fromTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ flexGrow: 1 }}
            />
            <TimePicker
              label="To"
              value={formData.toTime}
              onChange={(value) => handleTimeChange("toTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ flexGrow: 1 }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={status === "loading"}
            sx={{
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#16a34a" },
              mt: 3,
            }}
          >
            {status === "loading" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "ADD Visiting Days"
            )}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddVisitingDays;
