/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format } from "date-fns";
import {
  DoctorDetails,
  DoctorVisitingDays,
} from "../../interfaces/DoctorInterface";
import { doctorsApi } from "../../redux/apis/DoctorSlices/doctor_api";
import { visitingDaysApi } from "../../redux/apis/DoctorSlices/visitingDays_api";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/ToastMessage";

interface EditVisitingDayModalProps {
  open: boolean;
  onClose: () => void;
  visitingDay: DoctorVisitingDays | null;
  onUpdated: () => void;
}

const daysList = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EditVisitingDayModal: React.FC<EditVisitingDayModalProps> = ({
  open,
  onClose,
  visitingDay,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    doctorId: "" as number | "",
    day: "",
    fromTime: null as Date | null,
    toTime: null as Date | null,
  });

  const [doctorsList, setDoctorsList] = useState<DoctorDetails[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    getDoctors();
  }, []);

  useEffect(() => {
    if (visitingDay && doctorsList.length > 0) {
      const { doctor_name, id, day, start_time, end_time } = visitingDay;
      console.log(visitingDay);
      console.log(doctor_name);

      setFormData({
        name: doctor_name ?? "",
        doctorId: Number(id),
        day: day ?? "",
        fromTime: start_time ? new Date(`1970-01-01T${start_time}`) : null,
        toTime: end_time ? new Date(`1970-01-01T${end_time}`) : null,
      });
    }
  }, [visitingDay, doctorsList]);

  const getDoctors = async () => {
    const response = await doctorsApi.getAllDoctors();
    setDoctorsList(response);
  };

  const handleSelectChange =
    (key: "doctor" | "day") => (event: SelectChangeEvent<any>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [key === "doctor" ? "doctorId" : "day"]:
          key === "doctor" ? Number(value) : value,
      }));
    };

  const handleTimeChange = (key: "fromTime" | "toTime", value: Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!visitingDay) return;

      setStatus("loading");

      const updateData: any = {
        doctor_id: formData.doctorId.toString(),
        day: formData.day,
        start_time: formData.fromTime ? format(formData.fromTime, "HH:mm") : "",
        end_time: formData.toTime ? format(formData.toTime, "HH:mm") : "",
      };

      await visitingDaysApi.updateVisitingDays(visitingDay.id, updateData);
      setStatus("success");
      showSuccessToast("Visiting day updated successfully");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      setStatus("error");
      showErrorToast("Update failed");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Visiting Day</DialogTitle>
        <DialogContent dividers>
          {/* Doctor Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={
                formData.doctorId !== "" && !isNaN(formData.doctorId)
                  ? formData.doctorId
                  : ""
              }
              onChange={handleSelectChange("doctor")}
              input={<OutlinedInput label="Select Doctor" />}
            >
              {doctorsList.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Day Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Day</InputLabel>
            <Select
              value={formData.day}
              onChange={handleSelectChange("day")}
              input={<OutlinedInput label="Select Day" />}
            >
              {daysList.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Time Pickers */}
          <Box
            display="flex"
            gap={2}
            marginY={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <TimePicker
              label="From"
              value={formData.fromTime}
              onChange={(value) => handleTimeChange("fromTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="To"
              value={formData.toTime}
              onChange={(value) => handleTimeChange("toTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={status === "loading"}
            sx={{ minWidth: 100 }}
          >
            {status === "loading" ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditVisitingDayModal;
