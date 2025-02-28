import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About"
import Features from "./pages/Features";
import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";
import NormalTagLearn from "./pages/NormalTagLearn";
import SamsungLearn from "./pages/SamsungLearn";
import Contact from "./pages/Contact";
import AppleLearn from "./pages/AppleLearn";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/features" element={<Features/>} />
        <Route path="/NormalLearn" element={<NormalTagLearn/>}/>
        <Route path="/SamsungLearn" element={<SamsungLearn/>}/>
        <Route path="/AppleLearn" element={<AppleLearn/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
