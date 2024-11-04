// // Login.jsx
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Auth.css';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       // Handle login logic here
//     }, 1500);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-wrapper">
//         <div className="auth-inner">
//           <div className="row g-0">
//             {/* Left side - Illustration */}
//             <div className="col-lg-6 d-none d-lg-block">
//               <div className="illustration-wrapper">
//                 <div className="illustration-content">
//                   <h2 className="display-4 text-white mb-4">Welcome Back! 👋</h2>
//                   <p className="lead text-white-50">
//                     Continue your language learning journey with KidsLingo
//                   </p>
//                   <div className="auth-features mt-5">
//                     <div className="feature-item">
//                       <span className="feature-icon">🎯</span>
//                       <span className="feature-text">Track your progress</span>
//                     </div>
//                     <div className="feature-item">
//                       <span className="feature-icon">🏆</span>
//                       <span className="feature-text">Earn achievements</span>
//                     </div>
//                     <div className="feature-item">
//                       <span className="feature-icon">🌟</span>
//                       <span className="feature-text">Join fun activities</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right side - Login Form */}
//             <div className="col-lg-6">
//               <div className="auth-form-container">
//                 <div className="auth-header text-center mb-4">
//                   <div className="logo mb-4">🌍</div>
//                   <h1 className="h3">Login to KidsLingo</h1>
//                   <p className="text-muted">Please enter your credentials to continue</p>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-4">
//                     <label className="form-label">Email address</label>
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         📧
//                       </span>
//                       <input
//                         type="email"
//                         className="form-control"
//                         name="email"
//                         placeholder="Enter your email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <label className="form-label">Password</label>
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         🔒
//                       </span>
//                       <input
//                         type="password"
//                         className="form-control"
//                         name="password"
//                         placeholder="Enter your password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="d-flex justify-content-between align-items-center mb-4">
//                     <div className="form-check">
//                       <input
//                         type="checkbox"
//                         className="form-check-input"
//                         id="rememberMe"
//                         name="rememberMe"
//                         checked={formData.rememberMe}
//                         onChange={handleChange}
//                       />
//                       <label className="form-check-label" htmlFor="rememberMe">
//                         Remember me
//                       </label>
//                     </div>
//                     <Link to="/forgot-password" className="text-primary text-decoration-none">
//                       Forgot password?
//                     </Link>
//                   </div>

//                   <button
//                     type="submit"
//                     className="btn btn-primary w-100 mb-4"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                     ) : ''}
//                     {isLoading ? 'Logging in...' : 'Login'}
//                   </button>

//                   <div className="text-center">
//                     <p className="text-muted">
//                       Don't have an account?{' '}
//                       <Link to="/signup" className="text-primary text-decoration-none">
//                         Sign up
//                       </Link>
//                     </p>
//                   </div>

//                   <div className="divider my-4">
//                     <span className="divider-text">or continue with</span>
//                   </div>

//                   <div className="row g-3">
//                     <div className="col">
//                       <button type="button" className="btn btn-outline-secondary w-100">
//                         <img src="/api/placeholder/20/20" alt="Google" className="me-2" />
//                         Google
//                       </button>
//                     </div>
//                     <div className="col">
//                       <button type="button" className="btn btn-outline-secondary w-100">
//                         <img src="/api/placeholder/20/20" alt="Facebook" className="me-2" />
//                         Facebook
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;