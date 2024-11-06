import React, { useState } from 'react';
import './SubscriptionPage.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from './langpro.png';

const SubscriptionPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');

  return (
    <div className="subscription-container">
         {/* Navbar */}
<nav className="navbar navbar-expand-lg navbar-dark bg-dark full-screen">
  <div className="container">
    <Link to="/" className="navbar-brand d-flex align-items-center">
      <img src={logo} alt="KidsLingo Logo" className="navbar-logo" />
      <span className="h3 mb-0 ms-2">Lang Pro</span>
    </Link>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <Link to="/quizes" className="nav-link">Quizzes</Link>
        </li>
        <li className="nav-item">
          <Link to="/subscription" className="nav-link">Subscription</Link>
        </li>
      </ul>
      <div className="d-flex align-items-center">
        {isLoggedIn ? (
          <div className="dropdown">
            <img
              src={profilePicture || 'default-profile.png'} // Add a default profile picture
              alt="Profile"
              className="rounded-circle"
              width="40"
              height="40"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ 
                cursor: 'pointer',
                border: '2px solid #fff',
                marginLeft: '15px'
              }}
            />
            <ul 
              className="dropdown-menu dropdown-menu-end" 
              aria-labelledby="dropdownMenuButton"
              style={{
                backgroundColor: '#343a40',
                marginTop: '10px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <li>
                <Link 
                  className="dropdown-item text-light" 
                  to="/profile"
                  style={{ padding: '8px 20px' }}
                >
                  <i className="fas fa-user me-2"></i>Profile
                </Link>
              </li>
              <li>
                <Link 
                  className="dropdown-item text-light" 
                  to="/settings"
                  style={{ padding: '8px 20px' }}
                >
                  <i className="fas fa-cog me-2"></i>Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider" style={{ borderColor: 'rgba(255,255,255,0.1)' }}/></li>
              <li>
                <button 
                  className="dropdown-item text-light" 
                  onClick={handleLogout}
                  style={{ padding: '8px 20px' }}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowRegisterModal(true)}
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</nav>

      <h1 className="subscription-title">Upgrade Your Learning Experience</h1>
      <div className="subscription-card">
        <div className="package-name">Premium Package</div>
        <div className="price">
          <span className="currency">LKR</span>
          <span className="amount">2,500</span>
          <span className="period">/month</span>
        </div>
        <ul className="features">
          <li>Unlimited access to all quizzes</li>
          <li>Personalized learning path</li>
          <li>Advanced progress tracking</li>
          <li>Ad-free experience</li>
          <li>Priority customer support</li>
        </ul>
       <Link to="/payment"><button className="subscribe-button" onClick="">Subscribe Now</button></Link> 
      </div>
      <div className="guarantee">
        30-day money-back guarantee. No questions asked.
      </div>
    </div>
  );
};

export default SubscriptionPage;