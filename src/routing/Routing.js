import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../layout/Header"; // Ensure correct path
import Footer from "../layout/Footer"; // Ensure correct path
import Calender from "../pages/Calender";
import ErrorPage from "../pages/ErrorPage";
const Routing = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="calender" element={<Calender />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default Routing;
