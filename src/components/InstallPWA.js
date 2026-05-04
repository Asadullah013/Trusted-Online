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
      
      // Logic: User 10 second rukay tabhi banner dikhayein taake distraction na ho
      const timer = setTimeout(() => {
        // Check if already installed
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShowInstallBanner(true);
        }
      }, 10000); 

      return () => clearTimeout(timer);
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
      console.log('User installed the Trusted Online app');
    }
    
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed-bottom p-3" style={{ zIndex: 1050 }}>
      <div 
        className="alert alert-light shadow-lg border-0 rounded-4 d-flex align-items-center justify-content-between animate__animated animate__slideInUp"
        style={{ maxWidth: '500px', margin: '0 auto' }}
      >
        <div className="pe-3">
          <strong className="text-dark d-block">Get the Trusted Online App!</strong>
          <p className="small text-muted mb-0">Install for faster access and a better shopping experience.</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <button 
            className="btn btn-sm text-secondary fw-bold border-0" 
            onClick={() => setShowInstallBanner(false)}
            style={{ fontSize: '12px' }}
          >
            NOT NOW
          </button>
          <button 
            className="btn btn-sm btn-primary rounded-pill px-3 fw-bold" 
            onClick={handleInstallClick}
            style={{ fontSize: '12px' }}
          >
            INSTALL
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
