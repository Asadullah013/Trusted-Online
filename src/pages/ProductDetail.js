import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };

    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setIsInCart(existingCart.some(item => item.id === id));
    getProduct();
  }, [id]);

  const handleCartToggle = () => {
    let existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (!isInCart) {
      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrls ? product.imageUrls[0] : product.imageUrl,
        category: product.category,
        quantity: 1
      };
      existingCart.push(productToAdd);
      localStorage.setItem('cartItems', JSON.stringify(existingCart));
      setIsInCart(true);
    } else {
      existingCart = existingCart.filter(item => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(existingCart));
      setIsInCart(false);
    }
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleWhatsApp = () => {
    const phoneNumber = "923313514847"; 
    const productUrl = window.location.href; 
    
    const message = `*Assalam o Alaikum!* 
I am interested in buying this product from *S.io STORE*:

*Product Name:* ${product.name}
*Price:* Rs. ${product.price}
*Category:* ${product.category || 'General'}

*Product Link:* ${productUrl}

Please let me know the availability.`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`; 
    window.open(url, "_blank");
  };

  if (loading) return (
    <div className="container mt-5 text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!product) return <div className="container mt-5 text-center py-5"><h3>Product not found!</h3></div>;

  const images = product.imageUrls && product.imageUrls.length > 0 
                  ? product.imageUrls 
                  : [product.imageUrl];

  return (
    <div className="container mt-4 mt-md-5 mb-5">
      <div className="row g-lg-5">
        
        {/* Left: Image Section with Fixed Carousel Controls */}
        <div className="col-md-6 mb-4">
          <div className="sticky-top" style={{ top: '100px', zIndex: 1 }}>
            <div id="productCarousel" className="carousel slide shadow-sm border-0 rounded-5 overflow-hidden" data-bs-ride="carousel">
              
              {/* Indicators (Dots) - Visible only if multiple images exist */}
              {images.length > 1 && (
                <div className="carousel-indicators">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#productCarousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? 'active' : ''}
                      aria-current={index === 0 ? 'true' : 'false'}
                    ></button>
                  ))}
                </div>
              )}

              <div className="carousel-inner bg-white">
                {images.map((img, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
                      <img 
                        src={img} 
                        className="img-fluid" 
                        alt={product.name} 
                        style={{ maxHeight: '100%', objectFit: 'contain' }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls (Next/Prev) - Visible only if multiple images exist */}
              {images.length > 1 && (
                <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Right: Details Section */}
        <div className="col-md-6">
          <div className="ps-lg-4 mt-2">
            
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="badge bg-light text-primary border px-3 py-2 text-uppercase fw-bold mb-2" style={{ fontSize: '10px' }}>
                  {product.category || "General"}
                </span>
                <h1 className="fw-bold text-dark display-6 mb-1">{product.name}</h1>
              </div>

              {/* Cart Toggle Button */}
              <div onClick={handleCartToggle} style={{ cursor: 'pointer' }} className="text-center ms-3">
                <div 
                  className="rounded-4 d-flex align-items-center justify-content-center shadow-sm" 
                  style={{ 
                    width: '70px', 
                    height: '70px',
                    backgroundColor: isInCart ? '#198754' : '#ffffff', 
                    border: isInCart ? 'none' : '1px solid #dee2e6',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span 
                    className="fs-3" 
                    style={{ 
                      filter: isInCart ? 'brightness(0) invert(1)' : 'none',
                      transition: 'filter 0.3s ease' 
                    }}
                  >
                    🛒
                  </span>
                </div>
                <small className={`fw-bold d-block mt-2 ${isInCart ? 'text-success' : 'text-muted'}`} style={{ fontSize: '9px' }}>
                  {isInCart ? "ADDED" : "ADD TO CART"}
                </small>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-primary fw-bold m-0">Rs. {product.price}</h2>
            </div>
            
            <div className="bg-light p-4 rounded-4 mb-4">
              <h6 className="fw-bold text-dark text-uppercase small mb-2">Description</h6>
              <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                {product.description}
              </p>
            </div>

            <button 
              className="btn btn-success btn-lg w-100 py-3 fw-bold rounded-pill shadow-lg" 
              onClick={handleWhatsApp}
            >
              Purchase
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
