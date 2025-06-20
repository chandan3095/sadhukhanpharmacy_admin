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
import { useState } from "react";
import { Product } from "../../interfaces/ProductInterface";
import { productApi } from "../../redux/apis/ProductApis/product_api";
import { showSuccessToast } from "../../Components/ToastMessage";

const AddProducts = () => {
  const [formData, setFormData] = useState({
    name: "",
    mrpPrice: 0,
    Price: 0,
    image: null as File | null,
    imageUrl: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      !formData.name ||
      !formData.description ||
      !formData.mrpPrice ||
      !formData.Price ||
      !formData.image
    ) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64Image = await fileToBase64(formData.image);
      const productData: Product = {
        id: 0,
        name: formData.name,
        description: formData.description,
        mrp_price: formData.mrpPrice,
        price: formData.Price,
        image: base64Image,
      };

      const result = await productApi.createProduct(productData);

      if (result && result.data) {
        showSuccessToast("Product added successfully!");
        setFormData({
          name: "",
          image: null,
          imageUrl: "",
          description: "",
          mrpPrice: 0,
          Price: 0,
        });
      } else {
        setError("Failed to add Product.");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
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

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error message */}
      {error && (
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
            name="mrpPrice"
            type="number"
            value={formData.mrpPrice}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Current Price"
            name="Price"
            type="number"
            value={formData.Price}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Box>

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
