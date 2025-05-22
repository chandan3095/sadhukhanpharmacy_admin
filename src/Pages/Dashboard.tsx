import {
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
  Breadcrumbs,
  Link,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { API_BASE_URL } from "../constants/api";

const Dashboard = () => {
  const theme = useTheme();

  useEffect(() => {
    console.log(API_BASE_URL);
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
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
        Dashboard
      </Typography>

      <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.secondary">Dashboard</Typography>
      </Breadcrumbs>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          color="secondary"
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.125rem",
              md: "1.25rem",
            },
          }}
        >
          Doctor Schedule :
        </Typography>
        <Select
          defaultValue="Monday"
          size="small"
          sx={{
            minWidth: 120,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.primary.main,
            borderRadius: "34px",
            color: theme.palette.primary.main,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "& .MuiSelect-icon": {
              color: theme.palette.primary.main,
            },
          }}
        >
          <MenuItem value="Sunday">Sunday</MenuItem>
          <MenuItem value="Monday">Monday</MenuItem>
          <MenuItem value="Tuesday" disabled>
            Tuesday
          </MenuItem>
          <MenuItem value="Wednesday">Wednesday</MenuItem>
          <MenuItem value="Thursday">Thursday</MenuItem>
          <MenuItem value="Friday">Friday</MenuItem>
          <MenuItem value="Saturday">Saturday</MenuItem>
        </Select>
      </Box>

      {/* Doctor Schedule Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr 1fr",
        }}
        gap={2}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            sx={{
              boxShadow: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "10px",
              }}
            >
              <Typography
                variant="h6"
                color="primary"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.125rem",
                    md: "1.25rem",
                  },
                }}
              >
                Dr. Debjyoti Sadhukhan
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem",
                  },
                }}
              >
                MBBS, M.Pharma, B-Pharma, PHD, MS
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="secondary"
                mt={1}
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem",
                  },
                }}
              >
                Time: 08:30AM - 09:30AM
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Summary Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr 1fr",
        }}
        gap={2}
        mt={4}
      >
        {[
          { label: "DOCTOR", value: 12 },
          { label: "PRODUCT", value: 20 },
          { label: "OFFER", value: 3 },
          { label: "NOTICE", value: 2 },
        ].map((item) => (
          <Card
            key={item.label}
            sx={{
              boxShadow: 2,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                color="primary"
                fontWeight="bold"
                sx={{
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                    md: "1.125rem",
                  },
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="secondary"
                sx={{
                  fontSize: {
                    xs: "1.5rem",
                    sm: "2rem",
                    md: "2.5rem",
                  },
                }}
              >
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
