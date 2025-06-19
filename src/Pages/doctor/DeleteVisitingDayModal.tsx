import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { DoctorVisitingDays } from "../../interfaces/DoctorInterface";

interface DeleteVisitingDayModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  visitingDay: DoctorVisitingDays | null;
}

const DeleteVisitingDayModal: React.FC<DeleteVisitingDayModalProps> = ({
  open,
  onClose,
  onConfirm,
  visitingDay,
}) => {
  const handleDelete = () => {
    if (visitingDay?.id != null) {
      onConfirm(Number(visitingDay.id));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the visiting day:{" "}
          <b>{visitingDay?.day || "N/A"}</b>?
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

export default DeleteVisitingDayModal;
