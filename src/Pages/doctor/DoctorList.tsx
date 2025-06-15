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
import { visitingDaysApi } from "../../redux/apis/DoctorSlices/visitingDays_api";

interface GroupedDoctor {
  doctor: any;
  visitingDays: any[];
}

const DoctorList = () => {
  const navigate = useNavigate();
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleAddNew = () => {
    navigate("/add-doctor");
  };

  const handleEdit = (id: number) => {
    console.log(`Edit visiting day ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete visiting day ID: ${id}`);
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
                py: 1.5,
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

              {/* Control Buttons outside of the button area */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(doctor.id);
                  }}
                  sx={{ p: 1.2 }}
                >
                  <Edit
                    fontSize="small"
                    sx={{ fontSize: "1.3rem" }}
                    color="warning"
                  />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doctor.id);
                  }}
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

            {/* Accordion Details */}
            <AccordionDetails sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
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
                      <b>{day.day}</b>: {day.start_time} - {day.end_time}
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
    </Box>
  );
};

export default DoctorList;
