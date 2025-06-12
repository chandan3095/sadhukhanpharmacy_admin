/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  Button,
  CircularProgress, // For loading state
  Alert, // For error state
} from "@mui/material";
import { Edit, Delete, Search, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { DoctorDetails } from "../../interfaces/DoctorInterface";

const DoctorList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      console.log("Status is idle. Dispatching fetchDoctors...");
    } else {
      console.log(
        "Status is not idle:",
        status,
        "Not dispatching fetchDoctors."
      );
    }
  }, [status]);

  const handleEdit = (id: number) => {
    console.log(`Edit doctor with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete doctor with ID: ${id}`);
  };

  const handleAddNew = () => {
    navigate("/add-doctor");
  };

  const doctorsArray: DoctorDetails[] = [];

  return (
    <Box
      sx={{
        padding: 3,
        [theme.breakpoints.down("sm")]: {
          padding: 2,
        },
      }}
    >
      {/* Header Section */}
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        color="secondary"
        sx={{
          fontSize: {
            xs: "1.5rem",
            sm: "2rem",
            md: "2.25rem",
          },
        }}
      >
        Doctor List
      </Typography>

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator="›"
        aria-label="breadcrumb"
        sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "1rem" } }}
      >
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/">
          Dashboard
        </Link>
        <Typography color="text.secondary">Doctor List</Typography>
      </Breadcrumbs>

      {/* Search and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
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
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
          }}
        />

        {/* Add New Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            fontSize: {
              xs: "0.75rem",
              sm: "0.875rem",
            },
            padding: {
              xs: "5px 10px",
              sm: "6px 16px",
            },
          }}
        >
          Add New
        </Button>
      </Box>

      {/* Doctor Table */}
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto", // Enable horizontal scrolling
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell>
                <b style={{ color: "#fff" }}>Name</b>
              </TableCell>
              <TableCell>
                <b style={{ color: "#fff" }}>Specialist</b>
              </TableCell>
              <TableCell>
                <b style={{ color: "#fff" }}>Mobile</b>
              </TableCell>
              <TableCell>
                <b style={{ color: "#fff" }}>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Using doctorsArray which correctly points to the actual array */}
            {doctorsArray.length > 0 ? (
              // Scenario 1: Data is available and not empty
              doctorsArray.map((doctor) => (
                <TableRow key={doctor.id || Math.random()}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.specialist || "N/A"}</TableCell>
                  <TableCell>{doctor.degree || "N/A"}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(doctor.id)}
                      sx={{
                        "& svg": {
                          color: theme.palette.warning.main,
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                        },
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(doctor.id)}
                      sx={{
                        "& svg": {
                          color: theme.palette.error.main,
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : status === "loading" ? (
              // Scenario 2: Data is currently loading
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 3 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Loading doctors...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : status === "failed" ? (
              // Scenario 3: Fetching data failed
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 3 }}>
                  <Alert severity="error" sx={{ justifyContent: "center" }}>
                    Error: {"Failed to load doctors."}
                  </Alert>
                </TableCell>
              </TableRow>
            ) : (
              // Scenario 4: No doctors found (status is 'succeeded' but array is empty, or 'idle' before first fetch)
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 3 }}>
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DoctorList;
