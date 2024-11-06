import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Home.css';
import Swal from 'sweetalert2';
import logo from './langpro.png';

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
 
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    window.location.href = '/';
  };

  const quizzes = [
    { id: 1, icon: 'LK', title: 'Sinhala Quiz', level: 'Beginner' },
    { id: 2, icon: 'ph', title: 'Tagalog Quiz', level: 'Beginner' },
  ];

  const activities = [
    { id: 1, icon: '🎨', title: 'Coloring Activity', description: 'Learn colors in different languages' },
    { id: 2, icon: '🎵', title: 'Sing-Along', description: 'Learn through catchy songs' },
    { id: 3, icon: '📚', title: 'Story Time', description: 'Read interactive stories' },
  ];
<Link to="/terms" className="text-primary">Terms of Service</Link>

  const handleLogin = async () => {
    const response = await fetch('http://127.0.0.1:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
  
    const data = await response.json();
      
    if (response.ok) {
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username); 
      setUsername(data.username); 
      setIsLoggedIn(true);
      Swal.fire('Success', 'Login successful!', 'success');
      setShowLoginModal(false);
    } else {
      Swal.fire('Error', data.message || 'Login failed', 'error');
    }
  };

  const handleRegister = async () => {
    const response = await fetch('http://127.0.0.1:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: registerUsername, email: registerEmail, password: registerPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire('Success', 'Registration successful!', 'success');
      setShowRegisterModal(false);
    } else {
      Swal.fire('Error', data.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="language-learning-app">
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
      <button
        className="btn btn-dark dropdown-toggle d-flex align-items-center"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span className="me-2">{username}</span>
      </button>
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
                              

          {/* Hero Section */}
          <div className="hero-section">
        <div className="hero-content">
          <h1 className="display-4 fw-bold mb-4">Learn Languages the Fun Way! 🎈</h1>
          <p className="lead mb-4">Join thousands of kids on an exciting language learning adventure</p>
          <button className="btn btn-light btn-lg">Start Learning Now!</button>
        </div>
      </div>

      {/* Quiz Section */}
      <section id="quizzes" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Fun Quizzes 🎮</h2>
          <div className="row g-4">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body text-center">
                    <div className="display-4 mb-3">{quiz.icon}</div>
                    <h5 className="card-title">{quiz.title}</h5>
                    <p className="card-text text-muted">{quiz.level}</p>
                    <Link to="/quizes"><button className="btn btn-outline-primary">Start Quiz</button></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section
      <section id="activities" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Fun Activities 🎨</h2>
          <div className="row g-4">
            {activities.map(activity => (
              <div key={activity.id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body text-center">
                    <div className="display-4 mb-3">{activity.icon}</div>
                    <h5 className="card-title">{activity.title}</h5>
                    <p className="card-text">{activity.description}</p>
                    <button className="btn btn-primary">Try Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      
<footer className="footer">
  <div className="footer-content">
    <div className="footer-section about">
      <h3>Lang Pro</h3>
      <p>Empowering kids to learn languages through fun and interactive methods.</p>
      <div className="contact">
        <span><i className="fas fa-phone"></i> &nbsp; 123-456-789</span>
        <span><i className="fas fa-envelope"></i> &nbsp; info@langpro.com</span>
      </div>
      <div className="socials">
        <a href="#"><i className="fab fa-facebook"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-youtube"></i></a>
      </div>
    </div>
    <div className="footer-section links">
      <h3>Quick Links</h3>
      <ul>
        <li><Link to="/quizes">Quizzes</Link></li>
        <li><Link to="/activities">Activities</Link></li>
        <li><Link to="/progress">My Progress</Link></li>
        <li><Link to="/subscription">Subscription</Link></li>
      </ul>
    </div>
    <div className="footer-section contact-form">
      <h3>Contact us</h3>
      <form>
        <input type="email" name="email" className="text-input contact-input" placeholder="Your email address..." />
        <textarea name="message" className="text-input contact-input" placeholder="Your message..."></textarea>
        <button type="submit" className="btn btn-primary btn-block">Send</button>
      </form>
    </div>
  </div>
  <div className="footer-bottom">
    &copy; 2024 Lang Pro | Designed by Lang Pro | <Link to="/terms">Terms</Link> | <Link to="/privacy">Privacy</Link>
  </div>
</footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button type="button" className="btn-close" onClick={() => setShowLoginModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLoginModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Register</h5>
                <button type="button" className="btn-close" onClick={() => setShowRegisterModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegisterModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleRegister}>Register</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;