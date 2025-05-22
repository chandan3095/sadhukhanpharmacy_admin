import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Dashboard from "./Pages/Dashboard";
import AddDoctor from "./Pages/AddDoctor";
import AddProducts from "./Pages/AddProducts";
import AddOffer from "./Pages/AddOffer";
import AddNotice from "./Pages/AddNotice";
import DoctorList from "./Pages/DoctorList";
import ProductList from "./Pages/ProductList";
import OfferList from "./Pages/OfferList";
import NoticeList from "./Pages/NoticeList";
import LoginPage from "./Pages/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { reHydrateAuth } from "./redux/slices/authSlice";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authSlice.isAuthenticated
  );
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reHydrateAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
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
    </BrowserRouter>
  );
};

export default App;
