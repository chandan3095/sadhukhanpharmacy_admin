import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { Notice } from "../../interfaces/NoticeInterface";

interface DeleteNoticeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  notice: Notice | null;
}

const DeleteNoticeModal: React.FC<DeleteNoticeModalProps> = ({
  open,
  onClose,
  onConfirm,
  notice,
}) => {
  const handleDelete = () => {
    if (notice?.id != null) {
      onConfirm(notice.id);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the notice:{" "}
          <b>{notice?.title || "N/A"}</b>?
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

export default DeleteNoticeModal;
