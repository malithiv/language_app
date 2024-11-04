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

  const quizzes = [
    { id: 1, icon: '🇱🇰', title: 'Sinhala Quiz', level: 'Beginner' },
    { id: 2, icon: '🇬🇧', title: 'English Quiz', level: 'Intermediate' },
    { id: 3, icon: '🇮🇳', title: 'Tamil Quiz', level: 'Advanced' },
  ];

  const activities = [
    { id: 1, icon: '🎨', title: 'Coloring Activity', description: 'Learn colors in different languages' },
    { id: 2, icon: '🎵', title: 'Sing-Along', description: 'Learn through catchy songs' },
    { id: 3, icon: '📚', title: 'Story Time', description: 'Read interactive stories' },
  ];
<Link to="/terms" className="text-primary">Terms of Service</Link>
  const handleLogin = async () => {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('userId', data.userId); // Assuming the userId is returned in the response
      Swal.fire('Success', 'Login successful!', 'success');
      setShowLoginModal(false);
    } else {
      Swal.fire('Error', data.message || 'Login failed', 'error');
    }
  };

  const handleRegister = async () => {
    const response = await fetch('http://127.0.0.1:5000/register', {
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
            <span className="h3 mb-0 ms-2">KidsLingo</span>
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
                <Link to="/activities" className="nav-link">Activities</Link>
              </li>
              <li className="nav-item">
                <Link to="/progress" className="nav-link">My Progress</Link>
              </li>
            </ul>
            <div className="d-flex">
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

      {/* Activities Section */}
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
      </section>

      {/* Progress Section */}
      <section id="progress" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Track Your Progress 📈</h2>
          <div className="row align-items-center">
            <div className="col-md-6">
              <img
                src="/api/placeholder/500/300"
                alt="Progress tracking"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-6">
              <div className="progress-stats">
                <h4>Your Achievements</h4>
                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: '75%' }}
                  >
                    Words Learned: 75%
                  </div>
                </div>
                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: '60%' }}
                  >
                    Quizzes Completed: 60%
                  </div>
                </div>
                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: '45%' }}
                  >
                    Stories Read: 45%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark py-4 text-white text-center">
        <div className="container">
          <p className="mb-0">© 2024 KidsLingo. All rights reserved. 🌟</p>
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