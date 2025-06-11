import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO } from "date-fns";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Components/ToastMessage";
import { noticeApi } from "../../redux/apis/NoticeApis/notice_api";

interface EditNoticeModalProps {
  open: boolean;
  onClose: () => void;
  notice: {
    id: number;
    title: string;
    description: string;
    from_date_time: string;
    to_date_time: string;
  } | null;
  onUpdate: () => void;
}

const EditNoticeModal: React.FC<EditNoticeModalProps> = ({
  open,
  onClose,
  notice,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fromTime: null as Date | null,
    toTime: null as Date | null,
  });

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title,
        description: notice.description,
        fromTime: parseISO(notice.from_date_time),
        toTime: parseISO(notice.to_date_time),
      });
    }
  }, [notice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (key: "fromTime" | "toTime", value: Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.fromTime ||
      !formData.toTime
    ) {
      showErrorToast("Please fill all fields.");
      return;
    }

    if (!notice?.id) {
      showErrorToast("Invalid notice ID.");
      return;
    }

    const payload = {
      id: notice.id,
      title: formData.title,
      description: formData.description,
      from_date_time: format(formData.fromTime, "yyyy-MM-dd HH:mm:ss"),
      to_date_time: format(formData.toTime, "yyyy-MM-dd HH:mm:ss"),
    };

    try {
      await noticeApi.updateNotice(notice.id, payload);
      showSuccessToast("Notice updated successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update notice:", error);
      showErrorToast("Failed to update notice. Please try again.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: 4,
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            width: "90%",
            maxWidth: "600px",
            margin: "100px auto",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            color="secondary"
          >
            Edit Notice
          </Typography>

          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />

          <Box
            display="flex"
            gap={2}
            marginBottom={2}
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <DateTimePicker
              label="From"
              value={formData.fromTime}
              onChange={(value) => handleTimeChange("fromTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ flexGrow: 1 }}
            />
            <DateTimePicker
              label="To"
              value={formData.toTime}
              onChange={(value) => handleTimeChange("toTime", value)}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ flexGrow: 1 }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#22c55e",
              color: "#ffffff",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#1e40af" },
            }}
          >
            Update Notice
          </Button>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default EditNoticeModal;
