import React from "react";
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
} from "@mui/material";
import { Edit, Delete, Search, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

interface Doctor {
  name: string;
  speciality: string;
  fromTime: string;
  toTime: string;
}

const doctors: Doctor[] = [
  {
    name: "Dr. Debjyoti",
    speciality: "Child Specialist",
    fromTime: "10:00 AM",
    toTime: "02:00 PM",
  },
  {
    name: "Dr. Amit Kumar",
    speciality: "Cardiologist",
    fromTime: "03:00 PM",
    toTime: "06:00 PM",
  },
  {
    name: "Dr. Sunita Sharma",
    speciality: "Dermatologist",
    fromTime: "09:00 AM",
    toTime: "01:00 PM",
  },
];

const DoctorList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleEdit = (index: number) => {
    console.log(`Edit doctor at index ${index}`);
  };

  const handleDelete = (index: number) => {
    console.log(`Delete doctor at index ${index}`);
  };

  const handleAddNew = () => {
    navigate("/add-doctor");
  };

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
                <b style={{ color: "#fff" }}>Speciality</b>
              </TableCell>
              <TableCell>
                <b style={{ color: "#fff" }}>From Time</b>
              </TableCell>
              <TableCell>
                <b style={{ color: "#fff" }}>To Time</b>
              </TableCell>
              <TableCell>
                <b style={{ color: "#fff" }}>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor, index) => (
              <TableRow key={index}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.speciality}</TableCell>
                <TableCell>{doctor.fromTime}</TableCell>
                <TableCell>{doctor.toTime}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(index)}
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
                    onClick={() => handleDelete(index)}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DoctorList;
