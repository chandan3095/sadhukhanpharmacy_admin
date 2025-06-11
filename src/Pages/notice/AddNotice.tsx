import { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { noticeApi } from "../../redux/apis/NoticeApis/notice_api";
import { format } from "date-fns";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/ToastMessage";

const AddNotice = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fromTime: null as Date | null,
    toTime: null as Date | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (key: "fromTime" | "toTime", value: Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.fromTime ||
      !formData.toTime
    ) {
      showErrorToast("Please fill all fields.");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      from_date_time: format(formData.fromTime, "yyyy-MM-dd HH:mm:ss"),
      to_date_time: format(formData.toTime, "yyyy-MM-dd HH:mm:ss"),
    };

    try {
      await noticeApi.createNotice(payload);
      showSuccessToast("Notice created successfully!");
      setFormData({ title: "", description: "", fromTime: null, toTime: null });
    } catch (error) {
      console.error("Failed to create notice:", error);
      showErrorToast("Failed to create notice. Please try again.");
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
          Add Notice
        </Typography>

        {/* Breadcrumbs */}
        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/">
            Dashboard
          </Link>
          <Typography color="text.secondary">Add Notice</Typography>
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
          }}
        >
          {/* Name */}
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Description"
            name="description"
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            sx={{
              marginBottom: "0.5rem",
            }}
          />

          <Box
            display="flex"
            gap={2}
            marginBottom={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <DateTimePicker
              label="From"
              value={formData.fromTime}
              onChange={(value) => handleTimeChange("fromTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ flexGrow: 1 }}
            />
            <DateTimePicker
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
            sx={{
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#16a34a" },
            }}
          >
            ADD NOTICE
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddNotice;
