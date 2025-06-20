/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Add, Delete, Edit, ExpandMore, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { visitingDaysApi } from "../../redux/apis/DoctorAPis/visitingDays_api";
import EditDoctorModal from "./EditDoctorModal";
import {
  DoctorDetails,
  DoctorVisitingDays,
} from "../../interfaces/DoctorInterface";
import EditVisitingDayModal from "./EditVisitingDayModal";
import DeleteVisitingDayModal from "./DeleteVisitingDayModal";
import { parse, format, isValid } from "date-fns";

interface GroupedDoctor {
  doctor: any;
  visitingDays: any[];
}

const DoctorList = () => {
  const navigate = useNavigate();
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editVisitingModalOpen, setEditVisitingModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetails | null>(
    null
  );
  const [selectedVisitingday, setSelectedVisitingday] =
    useState<DoctorVisitingDays | null>(null);

  useEffect(() => {
    fetchDoctorsList();
  }, []);

  const fetchDoctorsList = async () => {
    try {
      const response = await visitingDaysApi.getAllVisitingDays();
      setDoctorsList(response);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch Doctors.");
    } finally {
      setLoading(false);
    }
  };

  const groupByDoctor = doctorsList.reduce<Record<string, GroupedDoctor>>(
    (acc, item) => {
      const docId = item.doctor.id;
      if (!acc[docId]) {
        acc[docId] = {
          doctor: item.doctor,
          visitingDays: [],
        };
      }
      acc[docId].visitingDays.push({
        id: item.id,
        day: item.day,
        start_time: item.start_time,
        end_time: item.end_time,
        is_active: item.is_active,
      });
      return acc;
    },
    {}
  );

  const handleEdit = (id: number) => {
    const group = Object.values(groupByDoctor).find((group) =>
      group.visitingDays.some((day) => day.id === id)
    );

    const visitingDay = group?.visitingDays.find((day) => day.id === id);

    if (visitingDay && group) {
      setSelectedVisitingday({
        ...visitingDay,
        doctor_name: group.doctor.name,
      });
      setEditVisitingModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const group = Object.values(groupByDoctor).find((group) =>
      group.visitingDays.some((day) => day.id === id)
    );

    const visitingDay = group?.visitingDays.find((day) => day.id === id);

    if (visitingDay && group) {
      setSelectedVisitingday({
        ...visitingDay,
        doctor_name: group.doctor.name,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      await visitingDaysApi.deleteVisitingDays(id);
      fetchDoctorsList();
    } catch (error) {
      console.error("Failed to delete visiting day:", error);
    } finally {
      setDeleteModalOpen(false);
      setSelectedVisitingday(null);
    }
  };

  const handleAddNew = () => {
    navigate("/add-doctor");
  };

  const handleDoctorEdit = (doctorId: number) => {
    const doctorToEdit = Object.values(groupByDoctor).find(
      (d) => d.doctor.id === doctorId
    )?.doctor;

    if (doctorToEdit) {
      setSelectedDoctor(doctorToEdit);
      setEditModalOpen(true);
    }
  };

  const handleModalClose = (type: "doctor" | "visitingDay") => {
    if (type === "doctor") {
      setEditModalOpen(false);
      setSelectedDoctor(null);
    } else if (type === "visitingDay") {
      setEditVisitingModalOpen(false);
      setSelectedVisitingday(null);
    }
  };

  const formatTime = (time: string) => {
    try {
      if (!time || !time.includes(":")) return time;

      // Use correct format string for time like "13:00:00"
      const parsed = parse(time, "HH:mm:ss", new Date());

      return isValid(parsed) ? format(parsed, "hh:mm a") : time;
    } catch (err) {
      console.error("Time parsing error:", err);
      return time;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="secondary">
        Doctor List
      </Typography>

      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Typography color="text.secondary">Doctor List</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: "100%", sm: "auto" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "34px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            },
          }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={handleAddNew}>
          Add New
        </Button>
      </Box>

      {loading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", height: "200px" }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        (
          Object.values(groupByDoctor) as { doctor: any; visitingDays: any[] }[]
        ).map(({ doctor, visitingDays }) => (
          <Accordion
            key={doctor.id}
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
              "&::before": { display: "none" },
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* Accordion Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                backgroundColor: "white",
                color: "#2eb774",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ fontSize: "1.5rem" }} />}
                sx={{
                  padding: 0,
                  margin: 0,
                  minHeight: "unset",
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  fontSize={{ xs: "0.95rem", sm: "1rem" }}
                >
                  {doctor.name} — {doctor.degree} ({doctor.specialist || "N/A"})
                </Typography>
              </AccordionSummary>
            </Box>

            {/* Accordion Details */}
            <AccordionDetails sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <IconButton
                  onClick={() => handleDoctorEdit(doctor.id)}
                  sx={{
                    // p: 1.2,
                    fontSize: "1rem",
                    backgroundColor: "#2eb774",
                    color: "#fff",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#2eb774",
                    },
                  }}
                >
                  <Edit
                    fontSize="small"
                    sx={{ fontSize: "1.3rem", marginRight: "0.2rem" }}
                  />
                  Edit Doctor
                </IconButton>
              </Box>

              {visitingDays.length > 0 ? (
                visitingDays.map((day) => (
                  <Box
                    key={day.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      px: 1,
                      py: 0.8,
                      borderBottom: "1px solid #eee",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography fontSize={{ xs: "0.9rem", sm: "1rem" }}>
                      <b style={{ color: "#2eb774" }}>{day.day}</b> :{" "}
                      {formatTime(day.start_time)} - {formatTime(day.end_time)}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() => handleEdit(day.id)}
                        sx={{ p: 1.2 }}
                      >
                        <Edit
                          fontSize="small"
                          sx={{ fontSize: "1.3rem" }}
                          color="warning"
                        />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(day.id)}
                        sx={{ p: 1.2 }}
                      >
                        <Delete
                          fontSize="small"
                          sx={{ fontSize: "1.3rem" }}
                          color="error"
                        />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography>No visiting days added.</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <EditDoctorModal
        open={editModalOpen}
        doctor={selectedDoctor}
        onClose={() => handleModalClose("doctor")}
        onSave={() => {
          handleModalClose("doctor");
          fetchDoctorsList();
        }}
      />

      <EditVisitingDayModal
        open={editVisitingModalOpen}
        visitingDay={selectedVisitingday}
        onClose={() => handleModalClose("visitingDay")}
        onUpdated={() => {
          handleModalClose("visitingDay");
          fetchDoctorsList();
        }}
      />

      <DeleteVisitingDayModal
        open={deleteModalOpen}
        visitingDay={selectedVisitingday}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedVisitingday(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default DoctorList;
