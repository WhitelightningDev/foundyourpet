import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Prices from "./pages/Prices";
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
import PublicPetProfile from "./pages/PublicPetProfile";
import SignupSuccess from "./components/SignupSuccess";
import TsAndCs from "./pages/T's&C's";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PasswordResetPage from "./pages/PasswordReset";
// Payment status pags
import SuccessPage from "./pages/SuccessPage";
import FailurePage from "./pages/FailurePage";
import CancelPage from "./pages/CancelPage";
import PetRedirect from "./pages/PetRedirect";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prices" element={<Prices />} />
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
          <Route path="/pet-profile/:petId" element={<PublicPetProfile />} />
          <Route path="/p/:petId" element={<PetRedirect />} />
          <Route path="/signup-success" element={<SignupSuccess />} />
          <Route path="/terms-and-conditions" element={<TsAndCs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/payment-success" element={<SuccessPage />} />
          <Route path="/payment-failure" element={<FailurePage />} />
          <Route path="/payment-cancel" element={<CancelPage />} />
          

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
