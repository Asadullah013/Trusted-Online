import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './Logo.png'; // Ensure path is correct based on your folder structure

const Navbar = ({ setSearchQuery, setSelectedCategory, isAdmin, handleLogout }) => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  const isActive = (path) => location.pathname === path ? 'text-primary' : 'text-muted';
  const isAdminPortal = location.pathname === '/admin';

  const updateCartCount = () => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const total = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  return (
    <>
      {/* Main Top Navbar */}
      <nav className="navbar navbar-light bg-white border-bottom sticky-top py-2">
        <div className="container-fluid px-2 px-md-4">
          <div className="d-flex align-items-center justify-content-between w-100 gap-2">
            
            {/* 1. Brand Logo (Using Logo.png) */}
            <Link className="navbar-brand d-flex align-items-center flex-shrink-0" to="/">
              <img 
                src={logo} 
                alt="Trusted Online Store" 
                style={{ height: '45px', width: 'auto', objectFit: 'contain' }}
                className="d-inline-block"
              />
            </Link>

            {/* 2. Unified Search & Category Box */}
            <div className="flex-grow-1 mx-md-3" style={{ maxWidth: '600px' }}>
              <div className="input-group input-group-sm rounded-pill overflow-hidden border bg-light shadow-sm">
                <select 
                  className="form-select border-0 bg-transparent text-muted fw-bold ps-3" 
                  style={{ maxWidth: '85px', fontSize: '11px', outline: 'none', cursor: 'pointer' }}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>

                <div className="vr my-2 opacity-25"></div>

                <input 
                  type="text" 
                  className="form-control border-0 bg-transparent px-2 shadow-none" 
                  placeholder="Search products..." 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
                
                <button className="btn border-0 text-muted px-2" type="button">🔍</button>
              </div>
            </div>

            {/* 3. PC Screen: Cart + Auth Icons */}
            <div className="d-none d-md-flex align-items-center gap-3 flex-shrink-0">
              <Link className={`nav-link p-0 position-relative ${isActive('/cart')}`} to="/cart">
                <span className="fs-4">🛒</span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="vr h-25 opacity-25"></div>

              {!isAdmin ? (
                <Link to="/login" className="nav-link p-0 text-muted" title="Login">
                  <span className="fs-4">👤</span>
                </Link>
              ) : isAdminPortal ? (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-link p-0 text-decoration-none text-danger border-0 shadow-none" 
                  title="Logout"
                >
                  <span className="fs-4">❌</span>
                </button>
              ) : (
                <Link to="/admin" className="nav-link p-0 text-primary" title="Admin Portal">
                  <span className="fs-4">👤</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile) */}
      <div className="d-md-none fixed-bottom bg-white border-top py-2 shadow-lg" style={{ zIndex: 1050 }}>
        <div className="d-flex justify-content-around align-items-center">
          <Link to="/" className={`text-decoration-none d-flex flex-column align-items-center ${isActive('/')}`}>
            <span className="fs-5">🏠</span>
            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Home</span>
          </Link>

          <Link to="/cart" className={`text-decoration-none d-flex flex-column align-items-center position-relative ${isActive('/cart')}`}>
            <span className="fs-5">🛒</span>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '8px' }}>
                {cartCount}
              </span>
            )}
            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Cart</span>
          </Link>

          {!isAdmin ? (
            <Link to="/login" className={`text-decoration-none d-flex flex-column align-items-center ${isActive('/login')}`}>
              <span className="fs-5">👤</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Login</span>
            </Link>
          ) : (
            <Link to="/admin" className={`text-decoration-none d-flex flex-column align-items-center ${isActive('/admin')}`}>
              <span className="fs-5">👤</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Admin</span>
            </Link>
          )}

          {isAdmin && (
            <button onClick={handleLogout} className="btn btn-link text-decoration-none d-flex flex-column align-items-center p-0 text-danger border-0 shadow-none">
              <span className="fs-5">❌</span>
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Exit</span>
            </button>
          )}
        </div>
      </div>

      {/* Spacer for Mobile Bottom Nav */}
      <div className="d-md-none" style={{ height: '65px' }}></div>
    </>
  );
};

export default Navbar;