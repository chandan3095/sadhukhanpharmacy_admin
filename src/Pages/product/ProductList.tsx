import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
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

interface Product {
  name: string;
  basePrice: number;
  currentPrice: number;
}

const products: Product[] = [
  {
    name: "Dr. Debjyoti",
    basePrice: 100.0,
    currentPrice: 80.0,
  },
  {
    name: "Dr. Amit Kumar",
    basePrice: 120.0,
    currentPrice: 106.0,
  },
  {
    name: "Dr. Sunita Sharma",
    basePrice: 210.0,
    currentPrice: 188.8,
  },
];
const ProductList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleEdit = (index: number) => {
    console.log(`Edit product at index ${index}`);
  };

  const handleDelete = (index: number) => {
    console.log(`Delete product at index ${index}`);
  };

  const handleAddNew = () => {
    navigate("/add-product");
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
                <b style={{ color: "#fff" }}>Base Price</b>
              </TableCell>
              <TableCell>
                <b style={{ color: "#fff" }}>Current Price</b>
              </TableCell>
              <TableCell>
                <b style={{ color: "#fff" }}>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.basePrice}</TableCell>
                <TableCell>{product.currentPrice}</TableCell>
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

export default ProductList;
