import React from 'react';
import './CompletePage.css';
import { useNavigate } from 'react-router-dom';

const CompletePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="complete-page-wrapper">
      <div className="thank-you-container">
        <div className="icon-container">
          <div className="check-icon">&#10004;</div>
        </div>
        <h1 className="thank-you-heading">Thank you</h1>
        <p className="thank-you-message">
          That’s all we need to start verifying your identity
        </p>
        <button className="back-button" onClick={handleLogout}>
          Back
        </button>
      </div>
    </div>
  );
};

export default CompletePage;