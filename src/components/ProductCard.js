import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div 
        className="card h-100 border-0 shadow-sm position-relative product-card-modern" 
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ 
          cursor: 'pointer', 
          borderRadius: '20px', 
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          background: '#fff'
        }}
      >
        {/* Category Badge */}
        <span 
          className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill fw-bold"
          style={{ zIndex: 2, fontSize: '10px', backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255,255,255,0.8)' }}
        >
          {product.category || "General"}
        </span>

        {/* Product Image Container - Fixed height with Contain logic */}
        <div className="d-flex align-items-center justify-content-center p-3" style={{ height: '250px', background: '#f8f9fa' }}>
          <img 
            src={product.imageUrl} 
            className="card-img-top" 
            alt={product.name} 
            style={{ 
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain', // Yeh image ko full show karega bina cut kiye
              transition: 'transform 0.5s ease' 
            }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        <div className="card-body p-4 d-flex flex-column">
          {/* Product Name */}
          <h6 className="fw-bold mb-1 text-dark text-truncate" style={{ fontSize: '1.1rem' }}>
            {product.name}
          </h6>

          {/* One-Line Description */}
          <p className="text-muted mb-3" style={{ 
            fontSize: '13px',
            display: '-webkit-box', 
            WebkitLineClamp: '1', 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            minHeight: '1.2em'
          }}>
            {product.description || "Premium quality product selected just for you."}
          </p>

          {/* Price & Action Button */}
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div>
              <span className="text-primary fw-bold fs-5">Rs. {product.price}</span>
            </div>
            
            <div 
              className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
              style={{ width: '35px', height: '35px', padding: '0' }}
            >
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>→</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-card-modern:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;