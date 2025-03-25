import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const AddProducts = () => {
  const [formData, setFormData] = useState({
    name: "",
    basePrice: 0,
    currentPrice: 0,
    image: null as File | null,
    imageUrl: "",
    description: "",
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
        Add Product
      </Typography>

      {/* Breadcrumbs */}
      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Typography color="text.secondary">Add Product</Typography>
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

        <Box display="flex" gap={2} marginY={2}>
          <TextField
            label="Base Price"
            name="baseprice"
            type="number"
            value={formData.basePrice}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Current Price"
            name="currentprice"
            type="number"
            value={formData.currentPrice}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Box>

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
          ADD PRODUCT
        </Button>
      </Box>
    </Box>
  );
};

export default AddProducts;
