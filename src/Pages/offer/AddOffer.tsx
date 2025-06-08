/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState } from "react";
import { format } from "date-fns";
import { Offer } from "../../interfaces/OfferInterface";
import { offerApi } from "../../redux/apis/OfferApis/offer_api";

const AddOffer = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: null as File | null,
    imageUrl: "",
    description: "",
    fromTime: null as Date | null,
    toTime: null as Date | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleTimeChange = (key: "fromTime" | "toTime", value: Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string); // includes base64 with MIME type
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.fromTime ||
      !formData.toTime ||
      !formData.image
    ) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const base64Image = await fileToBase64(formData.image);
      const offerData: Offer = {
        id: 0,
        title: formData.title,
        description: formData.description,
        from_date_time: format(formData.fromTime, "yyyy-MM-dd HH:mm:ss"),
        to_date_time: format(formData.toTime, "yyyy-MM-dd HH:mm:ss"),
        image: base64Image,
      };

      const result = await offerApi.createOffer(offerData);

      if (result && result.data) {
        setSuccessMessage("Offer added successfully!");
        setFormData({
          title: "",
          image: null,
          imageUrl: "",
          description: "",
          fromTime: null,
          toTime: null,
        });
      } else {
        setError("Failed to add offer.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ padding: 3 }}>
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
          Add Offer
        </Typography>

        <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/">
            Dashboard
          </Link>
          <Typography color="text.secondary">Add Offer</Typography>
        </Breadcrumbs>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Success message */}
        {successMessage && (
          <Alert
            severity="success"
            sx={{
              my: 2,
              backgroundColor: "green",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white",
              },
            }}
          >
            {successMessage}
          </Alert>
        )}

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            Error: {error}
          </Alert>
        )}

        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: 4,
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Box display="flex" alignItems="center" gap={2} marginY={2}>
            {formData.imageUrl && (
              <Avatar
                src={formData.imageUrl}
                alt="Preview"
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

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

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

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ width: "100%" }}
          >
            Add Offer
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddOffer;
