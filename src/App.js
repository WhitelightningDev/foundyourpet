import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";
import NormalTagLearn from "./pages/NormalTagLearn";
import SamsungLearn from "./pages/SamsungLearn";
import Contact from "./pages/Contact";
import AppleLearn from "./pages/AppleLearn";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import SelectTagPage from "./pages/SelectTagPage";
import CheckoutPage from "./pages/CheckoutPage";
import ManagePetsPage from "./pages/ManagePetsPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage"; // adjust path as needed

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features" element={<Features />} />
          <Route path="/NormalLearn" element={<NormalTagLearn />} />
          <Route path="/SamsungLearn" element={<SamsungLearn />} />
          <Route path="/AppleLearn" element={<AppleLearn />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/select-tag/:tagType" element={<SelectTagPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/manage-pets" element={<ManagePetsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
