import React, { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Browser ko default prompt dikhane se rokna
      e.preventDefault();
      // Event ko save kar lena taake baad mein trigger kar sakain
      setDeferredPrompt(e);
      
      // Logic: User 10 second rukay ya 30% scroll kare tabhi banner dikhayein
      setTimeout(() => {
        setShowInstallBanner(true);
      }, 10000); 
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Install prompt dikhana
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User installed the app');
    }
    
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed-bottom p-3 animate__animated animate__slideInUp" style={{ zIndex: 1050 }}>
      <div className="alert alert-light shadow-lg border-0 rounded-4 d-flex align-items-center justify-content-between">
        <div>
          <strong className="text-dark">S.io Store ko App banayen!</strong>
          <p className="small text-muted mb-0">Fast access aur offline browsing ke liye install karein.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary border-0" onClick={() => setShowInstallBanner(false)}>Nahi Shukria</button>
          <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={handleInstallClick}>Install</button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;