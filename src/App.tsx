import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Dashboard from "./Pages/Dashboard";
import AddDoctor from "./Pages/AddDoctor";
import AddProducts from "./Pages/AddProducts";
import AddOffer from "./Pages/offer/AddOffer";
import AddNotice from "./Pages/AddNotice";
import DoctorList from "./Pages/DoctorList";
import ProductList from "./Pages/ProductList";
import OfferList from "./Pages/offer/OfferList";
import NoticeList from "./Pages/NoticeList";
import LoginPage from "./Pages/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { reHydrateAuth } from "./redux/apis/authSlice";
import { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authSlice.isAuthenticated
  );
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = ({ isAuthLoaded }: { isAuthLoaded: boolean }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authSlice.isAuthenticated
  );

  if (!isAuthLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/add-product" element={<AddProducts />} />
        <Route path="/add-offer" element={<AddOffer />} />
        <Route path="/add-notice" element={<AddNotice />} />
        <Route path="/doctor-list" element={<DoctorList />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/offer-list" element={<OfferList />} />
        <Route path="/notice-list" element={<NoticeList />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      await dispatch(reHydrateAuth());
      setIsAuthLoaded(true);
    };
    rehydrate();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes isAuthLoaded={isAuthLoaded} />
    </BrowserRouter>
  );
};

export default App;
