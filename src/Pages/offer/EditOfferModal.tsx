/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Avatar,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Offer } from "../../interfaces/OfferInterface";
import { offerApi } from "../../redux/apis/OfferApis/offer_api";

interface EditOfferModalProps {
  open: boolean;
  onClose: () => void;
  offer: Offer | null;
  onSuccess: () => void;
}

const EditOfferModal: React.FC<EditOfferModalProps> = ({
  open,
  onClose,
  offer,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    image: null as File | null,
    imageUrl: "",
    description: "",
    fromTime: null as Date | null,
    toTime: null as Date | null,
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title,
        image: null,
        imageUrl: offer.image ? `${offer.image}` : "",
        description: offer.description,
        fromTime: new Date(offer.from_date_time),
        toTime: new Date(offer.to_date_time),
      });
    }
  }, [offer]);

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

  const handleTimeChange = (key: "fromTime" | "toTime", value: Date | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.fromTime ||
      !formData.toTime
    ) {
      alert("Please fill in all fields.");
      return;
    }

    let imagePayload: string | undefined;

    if (formData.image) {
      // New image uploaded
      const base64String = await fileToBase64(formData.image);
      imagePayload = base64String;
    } else if (formData.imageUrl) {
      const fullUrl = formData.imageUrl.startsWith("http")
        ? formData.imageUrl
        : `http://localhost:7020/${formData.imageUrl}`;

      try {
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error("Image not found");
        const blob = await response.blob();

        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        imagePayload = base64String;
      } catch (err) {
        alert("Failed to fetch and convert existing image.");
        return;
      }
    }

    const updatedData: Offer = {
      ...offer!,
      title: formData.title,
      description: formData.description,
      from_date_time: format(formData.fromTime, "yyyy-MM-dd HH:mm:ss"),
      to_date_time: format(formData.toTime, "yyyy-MM-dd HH:mm:ss"),
      image: imagePayload!,
    };

    await offerApi.updateOffer(updatedData.id, updatedData);
    onClose();
    onSuccess?.();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "600px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Edit Offer
          </Typography>

          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Box display="flex" alignItems="center" gap={2} my={2}>
            {formData.imageUrl && (
              <Avatar src={formData.imageUrl} sx={{ width: 64, height: 64 }} />
            )}
            <TextField
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleImageChange}
              fullWidth
            />
          </Box>

          <Box
            display="flex"
            gap={2}
            my={2}
            flexDirection={{ xs: "column", sm: "row" }}
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

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Update Offer
          </Button>
        </Box>
      </LocalizationProvider>
    </Modal>
  );
};

export default EditOfferModal;
