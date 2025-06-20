/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DoctorDetails } from "../../interfaces/DoctorInterface";
import { doctorsApi } from "../../redux/apis/DoctorAPis/doctor_api";
import {
  showSuccessToast,
  showErrorToast,
} from "../../Components/ToastMessage";

interface EditDoctorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  doctor: DoctorDetails | null;
}

const EditDoctorModal = ({
  open,
  onClose,
  onSave,
  doctor,
}: EditDoctorModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    specialist: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Populate form when modal opens or doctor changes
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || "",
        degree: doctor.degree || "",
        specialist: doctor.specialist || "",
      });
    }
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.degree || !formData.specialist) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setStatus("loading");

      const updatedDoctor: DoctorDetails = {
        id: doctor?.id || 0,
        name: formData.name,
        degree: formData.degree,
        specialist: formData.specialist,
      };

      await doctorsApi.updateDoctor(updatedDoctor.id, updatedDoctor);
      setStatus("success");
      showSuccessToast("Doctor updated successfully!");
      onSave(); // Refresh parent data
    } catch (err) {
      console.error(err);
      setStatus("error");
      showErrorToast("Update failed. Please try again.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Doctor</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Degree"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Specialist"
          name="specialist"
          value={formData.specialist}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={status === "loading"}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <CircularProgress size={20} />
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDoctorModal;
