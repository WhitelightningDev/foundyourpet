import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import SuccessPage from "./payments-response-pages/SuccessPage";
import FailurePage from "./payments-response-pages/FailurePage";
import CancelPage from "./payments-response-pages/CancelPage";
import PetRedirect from "./pages/PetRedirect";
import TagOrderTracking from "./pages/TagOrderTracking";
import ReportsFeed from "./pages/ReportsFeed";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { listenForForegroundMessages } from "@/lib/notifications";

function App() {
  useEffect(() => {
    let unsubscribe = () => {};

    listenForForegroundMessages((payload) => {
      const title = payload?.notification?.title || "New pet report";
      const description =
        payload?.notification?.body || payload?.data?.body || "Open the site to view details.";

      toast.message(title, { description });
    }).then((unsub) => {
      unsubscribe = typeof unsub === "function" ? unsub : () => {};
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <NavigationBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reports" element={<ReportsFeed />} />
              <Route path="/prices" element={<Prices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/features" element={<Features />} />
              <Route path="/NormalLearn" element={<NormalTagLearn />} />
              <Route path="/SamsungLearn" element={<SamsungLearn />} />
              <Route path="/AppleLearn" element={<AppleLearn />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/Login" element={<Navigate to="/login" replace />} />
              <Route path="/Signup" element={<Navigate to="/signup" replace />} />
              <Route path="/select-tag/:tagType" element={<SelectTagPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/manage-pets" element={<ManagePetsPage />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
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
                  <PrivateRoute requireAdmin>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tag-orders/:paymentId"
                element={
                  <PrivateRoute>
                    <TagOrderTracking />
                  </PrivateRoute>
                }
              />
              <Route path="/Dashboard" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
