import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Offer } from "../../interfaces/OfferInterface";

interface DeleteOfferModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  offer: Offer | null;
}

const DeleteOfferModal: React.FC<DeleteOfferModalProps> = ({
  open,
  onClose,
  onConfirm,
  offer,
}) => {
  const handleDelete = () => {
    if (offer?.id != null) {
      onConfirm(offer.id);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the offer:{" "}
          <b>{offer?.title || "N/A"}</b>?
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

export default DeleteOfferModal;
