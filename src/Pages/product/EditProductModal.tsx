/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Product, ProductResponse } from "../../interfaces/ProductInterface";
import { productApi } from "../../redux/apis/ProductApis/product_api";
import { showSuccessToast } from "../../Components/ToastMessage";

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  productData: ProductResponse | null;
  onUpdated?: () => void;
}

const EditProductModal = ({
  open,
  onClose,
  productData,
  onUpdated,
}: EditProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    mrpPrice: 0,
    Price: 0,
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.product.name,
        mrpPrice: productData.product.mrp_price,
        Price: productData.product.price,
        description: productData.product.description,
      });
    }
  }, [productData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.mrpPrice ||
      !formData.Price
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedProduct: Product = {
        id: productData?.product.id || 0,
        name: formData.name,
        description: formData.description,
        mrp_price: Number(formData.mrpPrice),
        price: Number(formData.Price),
      };

      await productApi.updateProduct(updatedProduct.id, updatedProduct);

      showSuccessToast("Product updated successfully!");
      onUpdated?.();
      onClose();
    } catch (err: any) {
      console.error("Error during product update:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred during update."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* <Box display="flex" alignItems="center" gap={2} marginY={2}>
          {formData.imageUrl && (
            <Avatar
              src={formData.imageUrl}
              alt="Product"
              sx={{ width: 64, height: 64 }}
            />
          )}
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleImageChange}
            fullWidth
          />
        </Box> */}

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
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          margin="normal"
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#0ea5e9",
            color: "#ffffff",
            fontWeight: "bold",
            mt: 2,
            borderRadius: 2,
            "&:hover": { backgroundColor: "#0284c7" },
          }}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update Product"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
