import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Login from './pages/Login'; 
import ProductDetail from './pages/ProductDetail';
import InstallPWA from './components/InstallPWA'; // Naya Component Import kiya

function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  
  // Search aur Category ki States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const logout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <Router>
      <Navbar 
        isAdmin={isAdmin} 
        handleLogout={logout} 
        setSearchQuery={setSearchQuery} 
        setSelectedCategory={setSelectedCategory} 
      />

      <div className="container" style={{ minHeight: '80vh' }}>
        <Routes>
          <Route 
            path="/" 
            element={<Home searchQuery={searchQuery} selectedCategory={selectedCategory} />} 
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login setAuth={setIsAdmin} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route 
            path="/admin" 
            element={isAdmin ? <Admin /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>

      {/* PWA Install Logic yahan add kar diya hai */}
      <InstallPWA />

    </Router>
  );
}

export default App;
