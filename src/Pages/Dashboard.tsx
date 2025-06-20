/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useState } from "react";
import { DoctorDetails } from "../interfaces/DoctorInterface";
import { Notice } from "../interfaces/NoticeInterface";
import { Offer } from "../interfaces/OfferInterface";
import { Product } from "../interfaces/ProductInterface";
import { doctorsApi } from "../redux/apis/DoctorAPis/doctor_api";
import { noticeApi } from "../redux/apis/NoticeApis/notice_api";
import { offerApi } from "../redux/apis/OfferApis/offer_api";
import { productApi } from "../redux/apis/ProductApis/product_api";
import { visitingDaysApi } from "../redux/apis/DoctorAPis/visitingDays_api";
import { parse, format, isValid } from "date-fns";

const Dashboard = () => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState<DoctorDetails[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [doctorsByDay, setDoctorsByDay] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const doctorRes = await doctorsApi.getAllDoctors();
      setDoctors(doctorRes);

      const noticeRes = await noticeApi.getAllNotices();
      setNotices(noticeRes.data);

      const offerRes = await offerApi.getAllOffers();
      setOffers(offerRes.data);

      const productRes = await productApi.getAllProducts();
      setProducts(productRes);

      fetchDoctorsByDay(selectedDay);
    };

    fetchAll();
  }, []);

  const fetchDoctorsByDay = async (day: string) => {
    const response = await visitingDaysApi.getVisitingDaysByDay(day);
    console.log(response);

    setDoctorsByDay(response.data);
  };

  const formatTime = (time: string) => {
    try {
      if (!time || !time.includes(":")) return time;

      const parsed = parse(time, "HH:mm:ss", new Date());

      return isValid(parsed) ? format(parsed, "hh:mm a") : time;
    } catch (err) {
      console.error("Time parsing error:", err);
      return time;
    }
  };

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
          value={selectedDay}
          onChange={(e) => {
            const day = e.target.value;
            setSelectedDay(day);
            fetchDoctorsByDay(day);
          }}
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
          <MenuItem value="sunday">Sunday</MenuItem>
          <MenuItem value="monday">Monday</MenuItem>
          <MenuItem value="tuesday" disabled>
            Tuesday
          </MenuItem>
          <MenuItem value="wednesday">Wednesday</MenuItem>
          <MenuItem value="thursday">Thursday</MenuItem>
          <MenuItem value="friday">Friday</MenuItem>
          <MenuItem value="saturday">Saturday</MenuItem>
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
        {doctorsByDay.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No doctors available for {selectedDay}
          </Typography>
        ) : (
          doctorsByDay.map((doc, index) => (
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
                    fontWeight: 600,
                  }}
                >
                  {doc.doctor.name}
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
                    fontWeight: 600,
                  }}
                >
                  {doc.doctor.degree}
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
                  Time: {formatTime(doc.start_time)} -{" "}
                  {formatTime(doc.end_time)}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
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
          { label: "DOCTOR", value: doctors.length },
          { label: "PRODUCT", value: products.length },
          { label: "OFFER", value: offers.length },
          { label: "NOTICE", value: notices.length },
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
