import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';

const Home = ({ searchQuery, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, "products"));
        const prodData = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prodData);
        setFilteredProducts(prodData);

        const carSnap = await getDocs(collection(db, "carousel"));
        setCarouselImages(carSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Data fetching error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = products.filter(p => {
      const matchesCategory = !selectedCategory || selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 pb-5 mt-0 mt-lg-2" style={{ background: 'transparent' }}>
      
      {/* =========================================
          TRANSPARENT, FULL-IMAGE CAROUSEL
          ========================================= */}
      {carouselImages.length > 0 && (
        <div id="darazStyleCarousel" className="carousel slide carousel-fade mb-3 mb-lg-5" data-bs-ride="carousel" style={{ background: 'transparent' }}>
          
          {/* Indicators */}
          <div className="carousel-indicators mb-1 mb-lg-3">
            {carouselImages.map((_, index) => (
              <button 
                key={index} 
                type="button" 
                data-bs-target="#darazStyleCarousel" 
                data-bs-slide-to={index} 
                className={`indicator-pill ${index === 0 ? 'active' : ''}`}
                style={{ outline: 'none' }}
              ></button>
            ))}
          </div>

          <div className="carousel-inner modern-inner" style={{ background: 'transparent' }}>
            {carouselImages.map((img, index) => (
              <div key={img.id} className={`carousel-item ${index === 0 ? 'active' : ''}`} style={{ background: 'transparent' }}>
                <div className="hero-img-container" style={{ background: 'transparent' }}>
                  <img 
                    src={img.imageUrl} 
                    className="d-block w-100 h-100 full-image-fit zoom-animation" 
                    alt="Banner" 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Minimalist Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#darazStyleCarousel" data-bs-slide="prev">
            <span className="glass-nav-box">‹</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#darazStyleCarousel" data-bs-slide="next">
            <span className="glass-nav-box">›</span>
          </button>
        </div>
      )}

      {/* =========================================
          PRODUCTS GRID
          ========================================= */}
      <div className="container">
        <div className="row g-3 g-md-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-light p-5 rounded-4 border border-dashed">
                <h4 className="fw-bold text-muted m-0">No products found</h4>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Desktop View */
        .modern-inner {
          aspect-ratio: 16 / 7;
          width: 100%;
          background: transparent !important;
        }

        .hero-img-container {
          width: 100%;
          height: 100%;
          background: transparent !important;
          overflow: hidden;
        }

        .full-image-fit {
          object-fit: contain; /* CRITICAL: 100% image dikhayega */
          background: transparent !important;
        }

        /* Responsive Mobile View Refinements */
        @media (max-width: 767px) {
          #darazStyleCarousel { 
            margin-top: -25px !important; /* Navbar ke sath gap khatam karne ke liye */
            margin-bottom: 15px !important; 
          } 
          
          .modern-inner { 
            aspect-ratio: 3 / 2; /* Mobile screen ke liye height adjustment */
          }

          .full-image-fit { 
            max-height: 220px; 
          }

          .glass-nav-box { 
            width: 30px !important; 
            height: 30px !important; 
            font-size: 1.2rem !important;
            background: rgba(0, 0, 0, 0.05) !important;
          }

          .indicator-pill {
            width: 8px !important;
            height: 3px !important;
          }
          
          .carousel-indicators .active.indicator-pill {
            width: 15px !important;
          }
        }

        /* General Styling */
        .indicator-pill {
          width: 12px;
          height: 4px;
          border-radius: 4px;
          border: none;
          background-color: rgba(0, 0, 0, 0.15);
          margin: 0 3px;
          transition: 0.3s;
        }

        .carousel-indicators .active.indicator-pill {
          background-color: #0d6efd;
          width: 20px;
        }

        .glass-nav-box {
          background: rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(4px);
          color: #333;
          font-size: 2rem;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s ease;
        }

        .glass-nav-box:hover {
          background: #0d6efd;
          color: #fff;
        }

        .zoom-animation {
          animation: zoomInSoft 15s infinite alternate;
        }
        @keyframes zoomInSoft {
          from { transform: scale(1); }
          to { transform: scale(1.03); }
        }

        .carousel-fade .carousel-item {
          transition-duration: 0.8s;
          transition-property: opacity;
        }
      `}</style>
    </div>
  );
};

export default Home;