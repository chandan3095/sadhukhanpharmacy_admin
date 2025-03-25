import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
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
