import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const removeFromCart = (e, id) => {
    e.stopPropagation(); // Yeh line card ke link ko click hone se rokegi
    const updatedCart = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="mb-4" style={{ fontSize: '4rem' }}>🛒</div>
        <h3 className="fw-bold">Your cart is empty</h3>
        <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary mt-3 px-4 rounded-pill fw-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Shopping Bag</h2>
        <span className="badge bg-primary rounded-pill px-3 py-2">
          {cartItems.length} Items
        </span>
      </div>
      
      {/* Product Grid */}
      <div className="row g-4">
        {cartItems.map((item) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
            {/* Card wrapped in a link to show product details */}
            <div 
              className="card h-100 border-0 shadow-sm product-card-modern position-relative" 
              style={{ borderRadius: '20px', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => navigate(`/product/${item.id}`)}
            >
              
              {/* Product Image Container */}
              <div className="d-flex align-items-center justify-content-center p-3" style={{ height: '200px', background: '#f8f9fa' }}>
                <img 
                  src={item.imageUrl} 
                  className="img-fluid" 
                  alt={item.name} 
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
                
                {/* Quantity Badge */}
                <span className="position-absolute top-0 end-0 badge bg-dark m-2 rounded-pill" style={{ fontSize: '10px' }}>
                  Qty: {item.quantity || 1}
                </span>
              </div>

              <div className="card-body p-3 d-flex flex-column">
                <h6 className="fw-bold text-dark text-truncate mb-1">{item.name}</h6>
                <p className="text-muted small mb-2">{item.category}</p>
                
                <h6 className="text-primary fw-bold mb-3">Rs. {item.price}</h6>
                
                {/* Remove Item Button with Event Stop Propagation */}
                <button 
                  className="btn btn-sm btn-outline-danger w-100 mt-auto rounded-pill fw-bold"
                  onClick={(e) => removeFromCart(e, item.id)}
                  style={{ fontSize: '12px' }}
                >
                  Remove Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Summary Section */}
      <div className="mt-5 p-4 bg-white rounded-4 shadow-sm border border-primary border-opacity-10">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
             <h5 className="text-muted mb-1">Estimated Total</h5>
             <h2 className="fw-bold text-dark m-0">
               Rs. {cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0)}
             </h2>
          </div>
          <div className="col-md-6 text-md-end">
            <button className="btn btn-success btn-lg px-5 rounded-pill fw-bold shadow-sm">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .product-card-modern {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card-modern:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default Cart;