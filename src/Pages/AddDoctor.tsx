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
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

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
  const [formData, setFormData] = useState({
    name: "",
    specialist: "",
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

  const handleSubmit = () => {
    console.log(formData);
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

        {/* Form Section */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: 4,
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "600px", // Make it responsive
            // margin: "0 auto",
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
          />

          {/* Degree */}
          <TextField
            label="Specialist"
            name="specialist"
            value={formData.specialist}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
          <Box display="flex" gap={2} marginY={2}>
            <TimePicker
              label="From"
              value={formData.fromTime}
              onChange={(value) => handleTimeChange("fromTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="To"
              value={formData.toTime}
              onChange={(value) => handleTimeChange("toTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>

          {/* Image Upload */}
          <Box display="flex" alignItems="center" gap={2} marginY={2}>
            {formData.imageUrl && (
              <Avatar
                src={formData.imageUrl}
                alt="Doctor Image"
                sx={{ width: 64, height: 64 }}
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
              }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#16a34a" },
            }}
          >
            ADD DOCTOR
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddDoctor;
