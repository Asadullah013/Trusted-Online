import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Admin = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [images, setImages] = useState([]); 
  const [carouselImg, setCarouselImg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [carouselList, setCarouselList] = useState([]);

  const fetchData = async () => {
    const prodSnap = await getDocs(collection(db, "products"));
    setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    const carSnap = await getDocs(collection(db, "carousel"));
    setCarouselList(carSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => { fetchData(); }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    const res = await fetch("https://api.cloudinary.com/v1_1/dnixaanm3/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleProductUpload = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please select at least one image");
    setIsUploading(true);
    try {
      const urls = [];
      for (const img of images) {
        const url = await uploadToCloudinary(img);
        urls.push(url);
      }

      await addDoc(collection(db, "products"), { 
        name, 
        price, 
        description, 
        category,
        imageUrls: urls, 
        imageUrl: urls[0], 
        createdAt: new Date() 
      });

      alert("Product with multiple images added!");
      setIsUploading(false);
      fetchData();
      e.target.reset();
      setImages([]);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const handleCarouselUpload = async (e) => {
    e.preventDefault();
    if(!carouselImg) return;
    setIsUploading(true);
    const url = await uploadToCloudinary(carouselImg);
    await addDoc(collection(db, "carousel"), { imageUrl: url, createdAt: new Date() });
    alert("Carousel Image Added!");
    setIsUploading(false);
    fetchData();
    setCarouselImg(null);
  };

  const removeDoc = async (collectionName, id) => {
    if(window.confirm(`Delete this item from ${collectionName}?`)) {
      await deleteDoc(doc(db, collectionName, id));
      fetchData();
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-5 fw-bold">Admin Dashboard</h2>
      
      <div className="row">
        {/* Add Product Form */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm mb-4 border-0">
            <h4 className="mb-3">Add New Product</h4>
            <form onSubmit={handleProductUpload}>
              <input type="text" placeholder="Product Name" className="form-control mb-2" required onChange={(e) => setName(e.target.value)} />
              <div className="row">
                <div className="col">
                  <input type="number" placeholder="Price" className="form-control mb-2" required onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="col">
                  <select className="form-control mb-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="General">General</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <textarea placeholder="Product Description" className="form-control mb-2" required rows="3" onChange={(e) => setDescription(e.target.value)}></textarea>
              <label className="small text-muted">Select Multiple Images:</label>
              <input type="file" className="form-control mb-3" multiple required onChange={(e) => setImages(Array.from(e.target.files))} />
              <button className="btn btn-primary w-100" disabled={isUploading}>
                {isUploading ? `Uploading ${images.length} images...` : "Upload Product"}
              </button>
            </form>
          </div>
        </div>

        {/* Add Carousel Form */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm mb-4 border-0" style={{borderLeft: '5px solid #ffc107'}}>
            <h4 className="mb-3">Add Carousel Image</h4>
            <form onSubmit={handleCarouselUpload}>
              <p className="text-muted small">Best size: 1200x400px</p>
              <input type="file" className="form-control mb-3" required onChange={(e) => setCarouselImg(e.target.files[0])} />
              <button className="btn btn-warning w-100" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Add to Carousel"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Manage Carousel Section - Added Back */}
      <div className="mt-5">
        <h4 className="fw-bold">Manage Carousel</h4>
        <div className="d-flex flex-wrap gap-3 mt-3">
          {carouselList.length > 0 ? carouselList.map(img => (
            <div key={img.id} className="position-relative shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
              <img src={img.imageUrl} alt="carousel" style={{width: '220px', height: '100px', objectFit: 'cover'}} />
              <button 
                onClick={() => removeDoc("carousel", img.id)} 
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                style={{ borderRadius: '50%', padding: '2px 8px' }}
              >
                &times;
              </button>
            </div>
          )) : <p className="text-muted">No carousel images found.</p>}
        </div>
      </div>

      {/* Manage Products Table */}
      <div className="mt-5">
        <h4 className="fw-bold">Manage Products</h4>
        <div className="table-responsive">
          <table className="table table-hover mt-3 shadow-sm text-center align-middle">
            <thead className="table-dark">
              <tr><th>Image</th><th>Name</th><th>Images Count</th><th>Price</th><th>Action</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><img src={p.imageUrl || (p.imageUrls && p.imageUrls[0])} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} alt={p.name} /></td>
                  <td className="fw-bold">{p.name}</td>
                  <td><span className="badge bg-info">{p.imageUrls ? p.imageUrls.length : 1}</span></td>
                  <td>Rs. {p.price}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => removeDoc("products", p.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;