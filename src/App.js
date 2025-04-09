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
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
