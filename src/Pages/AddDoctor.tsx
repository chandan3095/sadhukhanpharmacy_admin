/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  Avatar,
  SelectChangeEvent,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { format } from "date-fns";
import { Doctor } from "../interfaces/DoctorInterface";
import { createDoctor } from "../redux/slices/DoctorSlices/doctorSlice";

const daysList = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddDoctor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector(
    (state: RootState) => state.doctorSlice
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    specialist: "",
    mobile: "",
    days: [] as string[],
    fromTime: null as Date | null,
    toTime: null as Date | null,
    image: null as File | null,
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDaysChange = (event: SelectChangeEvent<string[]>) => {
    setFormData((prev) => ({ ...prev, days: event.target.value as string[] }));
  };

  const handleTimeChange = (key: "fromTime" | "toTime", value: Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    setSuccessMessage(null);

    if (!formData.name || !formData.degree || !formData.specialist) {
      alert("Please fill in all required fields: Name, Degree, Specialist.");
      return;
    }
    let uploadedImageUrl: string | null = null;
    if (formData.image) {
      console.log("Simulating image upload for:", formData.image.name);
      uploadedImageUrl = formData.imageUrl || null;
    }
    const formattedFromTime = formData.fromTime
      ? format(formData.fromTime, "HH:mm")
      : undefined;
    const formattedToTime = formData.toTime
      ? format(formData.toTime, "HH:mm")
      : undefined;
    const doctorData: Doctor = {
      id: 0,
      name: formData.name,
      degree: formData.degree,
      specialist: formData.specialist,
      mobile: formData.mobile || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add visitingDays ONLY if selected
    if (formData.days.length > 0) {
      doctorData.visitingDays = formData.days;
    }

    // --- IMPORTANT: ONLY UNCOMMENT THESE BLOCKS WHEN YOUR SERVER IS READY TO ACCEPT THEM ---
    // if (formattedFromTime) {
    //   doctorDataToSend.fromTime = formattedFromTime;
    // }
    // if (formattedToTime) {
    //   doctorDataToSend.toTime = formattedToTime;
    // }
    // if (uploadedImageUrl) {
    //   doctorDataToSend.image = uploadedImageUrl;
    // }

    const resultAction = await dispatch(createDoctor(doctorData));
    if (createDoctor.fulfilled.match(resultAction)) {
      setSuccessMessage("Doctor added successfully!");
      // Clear form after successful submission
      setFormData({
        name: "",
        degree: "",
        specialist: "",
        mobile: "",
        days: [],
        fromTime: null,
        toTime: null,
        image: null,
        imageUrl: "",
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ padding: 3 }}>
        {/* Header Section */}
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
          Add Doctor
        </Typography>

        {/* Breadcrumbs */}
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/">
            Dashboard
          </Link>
          <Typography color="text.secondary">Add Doctor</Typography>
        </Breadcrumbs>

        {/* Success/Error Messages */}
        {status === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {successMessage && (
          <Alert
            severity="success"
            sx={{
              my: 2,
              backgroundColor: "green",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white", // Change the icon color to white
              },
            }}
          >
            {successMessage}
          </Alert>
        )}
        {status === "failed" && error && (
          <Alert severity="error" sx={{ my: 2 }}>
            Error: {error}
          </Alert>
        )}

        {/* Form Section */}
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
          {/* Name */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required // Mark as required
          />

          {/* Degree - Added this field */}
          <TextField
            label="Degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required // Mark as required
          />

          {/* Specialist */}
          <TextField
            label="Specialist"
            name="specialist"
            value={formData.specialist}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required // Mark as required
          />

          {/* Mobile - Added this field */}
          <TextField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="tel" // Suggest tel keyboard on mobile
          />

          {/* Days */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Days</InputLabel>
            <Select
              multiple
              value={formData.days}
              onChange={handleDaysChange}
              input={<OutlinedInput label="Days" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {daysList.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Timing */}
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

          {/* Image Upload */}
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            marginY={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            {formData.imageUrl && (
              <Avatar
                src={formData.imageUrl}
                alt="Doctor Image"
                sx={{ width: 64, height: 64, flexShrink: 0 }}
              />
            )}
            <TextField
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleImageChange}
              fullWidth
              sx={{
                cursor: "pointer",
                "& input": {
                  cursor: "pointer",
                },
                flexGrow: 1,
              }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={status === "loading"} // Disable button while loading
            sx={{
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#16a34a" },
              mt: 3, // Margin top for button
            }}
          >
            {status === "loading" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "ADD DOCTOR"
            )}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddDoctor;
