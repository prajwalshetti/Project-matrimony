import { useState } from 'react';

export default function NotLoggedIn() {
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #FFF5E7 0%, #FFFFE0 50%, #FFE4E1 100%)'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.15)',
    padding: '60px 40px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    border: '2px solid rgba(255, 182, 193, 0.3)'
  };

  const iconStyle = {
    width: '80px',
    height: '80px',
    margin: '0 auto 30px',
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB6C1 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: 'white',
    boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)'
  };

  const headingStyle = {
    color: '#FF6B6B',
    fontSize: '32px',
    marginBottom: '16px',
    fontWeight: '600'
  };

  const paragraphStyle = {
    color: '#8B4513',
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '32px'
  };

  const buttonStyle = {
    display: 'inline-block',
    background: isHovered 
      ? 'linear-gradient(135deg, #FF8080 0%, #FF6B6B 100%)'
      : 'linear-gradient(135deg, #FF6B6B 0%, #FF8080 100%)',
    color: 'white',
    padding: '16px 48px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    boxShadow: isHovered 
      ? '0 6px 20px rgba(255, 107, 107, 0.4)'
      : '0 4px 16px rgba(255, 107, 107, 0.3)',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>🔒</div>
        
        <h1 style={headingStyle}>Not Logged In</h1>
        
        <p style={paragraphStyle}>
          Oops! It looks like you're not logged in. Please log in to access this page and continue your journey.
        </p>
        
        <button
          onClick={handleLogin}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={buttonStyle}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}