import { useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  TextField,
  Typography,
} from "@mui/material";

const AddNotice = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = () => {
    console.log(formData);
  };
  return (
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
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Description"
          variant="outlined"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          sx={{
            marginBottom: "1rem",
          }}
        />

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
  );
};

export default AddNotice;
