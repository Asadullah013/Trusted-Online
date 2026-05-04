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

function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  
  // Search aur Category ki States yahan define hain
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const logout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <Router>
      {/* Navbar ko functions pass kar diye gaye hain */}
      <Navbar 
        isAdmin={isAdmin} 
        handleLogout={logout} 
        setSearchQuery={setSearchQuery} 
        setSelectedCategory={setSelectedCategory} 
      />

      <div className="container" style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Home ko states pass kar di hain filtering ke liye */}
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

      <footer className="text-center mt-5 p-4 border-top bg-light">
        <p className="mb-0 text-muted">&copy; 2026 My Clothing Store | Designed by Asadullah</p>
      </footer>
    </Router>
  );
}

export default App;