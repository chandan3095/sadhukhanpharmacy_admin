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
import { Notice } from "../../interfaces/NoticeInterface";
import { noticeApi } from "../../redux/apis/NoticeApis/notice_api";
import EditNoticeModal from "./EditNoticeModal";
import DeleteNoticeModal from "./DeleteNoticeModal";

const NoticeList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await noticeApi.getAllNotices();
      setNotices(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch Notices.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    const noticeToEdit = notices[index];
    setSelectedNotice(noticeToEdit);
    setEditModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const noticeToDelete = notices[index];
    setSelectedNotice(noticeToDelete);
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedNotice(null);
  };

  const handleEditSuccess = () => {
    handleModalClose();
    fetchNotices();
  };

  const handleAddNew = () => {
    navigate("/add-notice");
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      await noticeApi.deleteNotice(id);
      fetchNotices();
    } catch (error) {
      console.error("Failed to delete notice:", error);
      setError("Failed to delete notice.");
    }
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        Notice List
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
        <Typography color="text.secondary">Notice List</Typography>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell>
                  <b style={{ color: "#fff" }}>Name</b>
                </TableCell>
                <TableCell>
                  <b style={{ color: "#fff" }}>Description</b>
                </TableCell>
                <TableCell>
                  <b style={{ color: "#fff" }}>From Date</b>
                </TableCell>
                <TableCell>
                  <b style={{ color: "#fff" }}>To Date</b>
                </TableCell>
                <TableCell>
                  <b style={{ color: "#fff" }}>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Notice found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotices.map((notice, index) => (
                  <TableRow key={notice.id || index}>
                    <TableCell>{notice.title}</TableCell>
                    <TableCell>{notice.description}</TableCell>
                    <TableCell>{notice.from_date_time}</TableCell>
                    <TableCell>{notice.to_date_time}</TableCell>
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

      <EditNoticeModal
        onClose={handleModalClose}
        notice={selectedNotice}
        open={editModalOpen}
        onUpdate={handleEditSuccess}
      />

      <DeleteNoticeModal
        notice={selectedNotice}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedNotice(null);
        }}
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default NoticeList;
