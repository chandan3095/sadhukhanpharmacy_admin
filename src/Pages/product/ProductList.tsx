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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product, ProductResponse } from "../../interfaces/ProductInterface";
import { productApi } from "../../redux/apis/ProductApis/product_api";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import {
  showErrorToast,
  showWarningToast,
} from "../../Components/ToastMessage";

const ProductList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  type ProductFromApi = Product & { image_url: string };

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAllProducts();
      const getProducts: ProductResponse[] = (response as ProductFromApi[]).map(
        (product) => ({
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            image: product.image,
            mrp_price: Number(product.mrp_price),
            price: Number(product.price),
          },
          image_url: product.image_url,
        })
      );
      setProducts(getProducts);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    const productToEdit = products[index];
    setSelectedProduct(productToEdit);
    setEditModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const offerToDelete = products[index];
    setSelectedProduct(offerToDelete);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await productApi.deleteProduct(id);
      showErrorToast("Product Deleted Successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete offer:", error);
      setError("Failed to delete offer.");
      showWarningToast("Product Delete Failed!");
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditSuccess = () => {
    handleModalClose();
    fetchProducts();
  };

  const handleAddNew = () => {
    navigate("/add-product");
  };

  const filteredProducts = products.filter((product) =>
    product.product.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
        Product List
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
        <Typography color="text.secondary">Product List</Typography>
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
                  <b style={{ color: "#fff" }}>Base Price</b>
                </TableCell>
                <TableCell>
                  <b style={{ color: "#fff" }}>Current Price</b>
                </TableCell>
                <TableCell>
                  <b style={{ color: "#fff" }}>Image</b>
                </TableCell>
                <TableCell>
                  <b style={{ color: "#fff" }}>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((productData, index) => (
                <TableRow key={index}>
                  <TableCell>{productData.product.name}</TableCell>
                  <TableCell>₹{productData.product.mrp_price}</TableCell>
                  <TableCell>₹{productData.product.price}</TableCell>
                  <TableCell>
                    <img
                      src={productData.image_url}
                      alt={productData.product.name}
                      style={{
                        width: "100px",
                        height: "auto",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </TableCell>
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
      )}

      <EditProductModal
        open={editModalOpen}
        onClose={handleModalClose}
        productData={selectedProduct}
        onUpdated={handleEditSuccess}
      />

      <DeleteProductModal
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ProductList;
