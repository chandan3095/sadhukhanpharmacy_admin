/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Offer } from "../../interfaces/OfferInterface";
import EditOfferModal from "./EditOfferModal";
import { offerApi } from "../../redux/apis/OfferApis/offer_api";
import DeleteOfferModal from "./DeleteOfferModal";

const OfferList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offerApi.getAllOffers();
      setOffers(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch offers.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    const offerToEdit = offers[index];
    setSelectedOffer(offerToEdit);
    setEditModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const offerToDelete = offers[index];
    setSelectedOffer(offerToDelete);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await offerApi.deleteOffer(id);
      fetchOffers();
    } catch (error) {
      console.error("Failed to delete offer:", error);
      setError("Failed to delete offer.");
    }
  };

  const handleAddNew = () => {
    navigate("/add-offer");
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedOffer(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    fetchOffers();
  };

  const filteredOffers = offers.filter((offer) =>
    offer.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        padding: 3,
        [theme.breakpoints.down("sm")]: {
          padding: 2,
        },
      }}
    >
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
        Offer List
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
        <Typography color="text.secondary">Offer List</Typography>
      </Breadcrumbs>

      {/* Top Actions */}
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
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: "100%", sm: "250px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "34px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            },
          }}
        />

        {/* Add Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddNew}
        >
          Add New Offer
        </Button>
      </Box>

      {/* Loading/Error */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2eb774" }}>
                <TableCell sx={{ color: "white" }}>Title</TableCell>
                <TableCell sx={{ color: "white" }}>Description</TableCell>
                <TableCell sx={{ color: "white" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No offers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers.map((offer, index) => (
                  <TableRow key={offer.id || index}>
                    <TableCell>{offer.title}</TableCell>
                    <TableCell>{offer.description}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(index)}>
                        <Edit sx={{ color: "#2eb774" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(index)}>
                        <Delete sx={{ color: "red" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedOffer && (
        <EditOfferModal
          open={editModalOpen}
          offer={selectedOffer}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}

      <DeleteOfferModal
        offer={selectedOffer}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedOffer(null);
        }}
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default OfferList;
