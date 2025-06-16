import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { ProductResponse } from "../../interfaces/ProductInterface";

interface DeleteProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  product: ProductResponse | null;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  open,
  onClose,
  onConfirm,
  product,
}) => {
  const handleDelete = () => {
    if (product?.product.id != null) {
      onConfirm(product.product.id);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the product:{" "}
          <b>{product?.product.name || "N/A"}</b>?
        </Typography>
        <Typography color="error" sx={{ mt: 1 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductModal;
