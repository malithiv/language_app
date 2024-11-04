// // Signup.jsx
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Auth.css';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     age: '',
//     parentEmail: '',
//     termsAccepted: false
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     if (name === 'password') {
//       // Simple password strength calculation
//       let strength = 0;
//       if (value.length >= 8) strength += 25;
//       if (value.match(/[A-Z]/)) strength += 25;
//       if (value.match(/[0-9]/)) strength += 25;
//       if (value.match(/[^A-Za-z0-9]/)) strength += 25;
//       setPasswordStrength(strength);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       // Handle signup logic here
//     }, 1500);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-wrapper">
//         <div className="auth-inner">
//           <div className="row g-0">
//             {/* Left side - Illustration */}
//             <div className="col-lg-6 d-none d-lg-block">
//               <div className="illustration-wrapper signup-illustration">
//                 <div className="illustration-content">
//                   <h2 className="display-4 text-white mb-4">Join the Fun! 🎉</h2>
//                   <p className="lead text-white-50">
//                     Start your exciting language learning adventure today
//                   </p>
//                   <div className="auth-features mt-5">
//                     <div className="feature-item">
//                       <span className="feature-icon">🎮</span>
//                       <span className="feature-text">Interactive Games</span>
//                     </div>
//                     <div className="feature-item">
//                       <span className="feature-icon">🎵</span>
//                       <span className="feature-text">Fun Songs</span>
//                     </div>
//                     <div className="feature-item">
//                       <span className="feature-icon">👥</span>
//                       <span className="feature-text">Learn with Friends</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right side - Signup Form */}
//             <div className="col-lg-6">
//               <div className="auth-form-container">
//                 <div className="auth-header text-center mb-4">
//                   <div className="logo mb-4">🌍</div>
//                   <h1 className="h3">Create Your Account</h1>
//                   <p className="text-muted">Join thousands of happy learners!</p>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-3">
//                     <label className="form-label">Full Name</label>
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         👤
//                       </span>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="fullName"
//                         placeholder="Enter your full name"
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="mb-3">
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

//                   <div className="mb-3">
//                     <label className="form-label">Age</label>
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         🎂
//                       </span>
//                       <input
//                         type="number"
//                         className="form-control"
//                         name="age"
//                         placeholder="Enter your age"
//                         value={formData.age}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   {parseInt(formData.age) < 13 && (
//                     <div className="mb-3">
//                       <label className="form-label">Parent's Email</label>
//                       <div className="input-group">
//                         <span className="input-group-text">
//                           👪
//                         </span>
//                         <input
//                           type="email"
//                           className="form-control"
//                           name="parentEmail"
//                           placeholder="Enter parent's email"
//                           value={formData.parentEmail}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                       <small className="text-muted">
//                         Required for users under 13 years old
//                       </small>
//                     </div>
//                   )}

//                   <div className="mb-3">
//                     <label className="form-label">Password</label>
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         🔒
//                       </span>
//                       <input
//                         type="password"
//                         className="form-control"
//                         name="password"
//                         placeholder="Create a password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     {formData.password && (
//                       <div className="password-strength mt-2">
//                         <div className="progress">
//                           <div
//                             className={`progress-bar ${
//                               passwordStrength >= 75 ? 'bg-success' :
//                               passwordStrength >= 50 ? 'bg-info' :
//                               passwordStrength >= 25 ? 'bg-warning' : 'bg-danger'
//                             }`}
//                             style={{ width: `${passwordStrength}%` }}
//                           ></div>
//                         </div>
//                         <small className="text-muted">
//                           Password strength: {
//                             passwordStrength >= 75 ? 'Strong' :
//                             passwordStrength >= 50 ? 'Good' :
//                             passwordStrength >= 25 ? 'Fair' : 'Weak'
//                           }
//                         </small>
//                       </div>
//                     )}
//                   </div>

//                   <div className="mb-4">
//                     <label className="form-label">Confirm Password</label>
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         🔒
//                       </span>
//                       <input
//                         type="password"
//                         className="form-control"
//                         name="confirmPassword"
//                         placeholder="Confirm your password"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="mb-4">
//                     <div className="form-check">
//                       <input
//                         type="checkbox"
//                         className="form-check-input"
//                         id="termsAccepted"
//                         name="termsAccepted"
//                         checked={formData.termsAccepted}
//                         onChange={handleChange}
//                         required
//                       />
//                       <label className="form-check-label" htmlFor="termsAccepted">
//                         I agree to the{' '}
//                         <Link to="/terms" className="text-primary">Terms of Service</Link>
//                         {' '}and{' '}
//                         <Link to="/privacy" className="text-primary">Privacy Policy</Link>
//                       </label>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     className="btn btn-primary w-100 mb-4"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                     ) : ''}
//                     {isLoading ? 'Creating Account...' : 'Create Account'}
//                   </button>

//                   <div className="text-center">
//                     <p className="text-muted">
//                       Already have an account?{' '}
//                       <Link to="/login" className="text-primary text-decoration-none">
//                         Login
//                       </Link>
//                     </p>
//                   </div>

//                   <div className="divider my-4">
//                     <span className="divider-text">or sign up with</span>
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

// export default Signup;