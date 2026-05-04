import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Environment variables se credentials fetch ho rahe hain
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (email === adminEmail && pass === adminPassword) {
      localStorage.setItem('isAdmin', 'true');
      setAuth(true);
      navigate('/admin');
    } else {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <div className="card p-4 shadow border-0" style={{ borderRadius: '20px' }}>
            <h3 className="text-center mb-4 fw-bold">Seller Login</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="small fw-bold text-muted">Email Address</label>
                <input 
                  type="email" 
                  placeholder="seller@example.com" 
                  className="form-control rounded-pill px-3" 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="small fw-bold text-muted">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="form-control rounded-pill px-3" 
                  onChange={e => setPass(e.target.value)} 
                  required 
                />
              </div>
              <button className="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm">
                Login as Seller
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
