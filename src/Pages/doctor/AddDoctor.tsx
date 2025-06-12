import { useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { doctorsApi } from "../../redux/apis/DoctorSlices/doctor_api";
import { DoctorDetails } from "../../interfaces/DoctorInterface";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/ToastMessage";

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    specialist: "",
    image: null as File | null,
    imageUrl: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleSubmit: () => Promise<void> = async () => {
    if (!formData.name || !formData.degree || !formData.specialist) {
      alert("Please fill in all required fields: Name, Degree, Specialist.");
      return;
    }

    try {
      setStatus("loading");
      // TODO: Handle actual image upload to server and get URL
      // let uploadedImageUrl: string | null = null;

      if (formData.image) {
        console.log("Simulating image upload for:", formData.image.name);
        // uploadedImageUrl = formData.imageUrl || null;
      }

      const doctorData: DoctorDetails = {
        id: 0,
        name: formData.name,
        degree: formData.degree,
        specialist: formData.specialist,
      };

      await doctorsApi.createDoctor(doctorData);

      setStatus("success");
      showSuccessToast("Doctor Added Successfully!");

      setFormData({
        name: "",
        degree: "",
        specialist: "",
        image: null,
        imageUrl: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      setStatus("error");
      showErrorToast("Failed!");
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

        {/* Loading Indicator */}
        {status === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Form Section */}
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
          {/* Name */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          {/* Degree */}
          <TextField
            label="Degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          {/* Specialist */}
          <TextField
            label="Specialist"
            name="specialist"
            value={formData.specialist}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

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
              inputRef={fileInputRef}
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
              "ADD DOCTOR"
            )}
          </Button>

          {/* Status Messages */}
          {status === "success" && (
            <Typography color="green" mt={2}>
              Doctor added successfully!
            </Typography>
          )}
          {status === "error" && (
            <Typography color="error" mt={2}>
              Failed to add doctor. Please try again.
            </Typography>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddDoctor;
