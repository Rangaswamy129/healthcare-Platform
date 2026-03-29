import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorList from "./pages/DoctorList";
import Appointment from "./pages/Appointment";
import Dashboard from "./pages/Dashboard";
import VideoCall from "./pages/VideoCall";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/appointment/:id" element={<Appointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video/:id" element={<VideoCall />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
