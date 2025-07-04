import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isValidEmail } from '../utils/validation';
import { forgotPassword, handleAuthError } from '../services/authService';
import { ROUTES, ERROR_MESSAGES } from '../utils/constants';
import FormField from '../../components/common/FormField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../assets/css/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error(ERROR_MESSAGES.EMAIL_REQUIRED);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(ERROR_MESSAGES.INVALID_EMAIL);
      return; 
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link sent! Check your email.');
    } catch (error) { 
      toast.error(handleAuthError(error) || 'Failed to send reset email');
    } finally { 
      setLoading(false);
    }
  };

  const handleChange = (e) => { setEmail(e.target.value); };

  if (submitted) {
    return (
      <div className="reset-container">
        <div className="logo-container">
          <img src="/assets/images/logo.png" alt="Company Logo" className="logo" />
        </div>
        
        <div className="text-center">
          <div className="mb-4">
            <div className="text-success mb-3"><i className="fas fa-check-circle fa-3x"></i></div>
            <h3>Check Your Email</h3>
            <p className="text-muted"> We've sent a password reset link to <strong>{email}</strong> </p>
            <p className="text-muted small"> Didn't receive the email? Check your spam folder or try again. </p>
          </div>
          
          <div className="d-flex gap-2 justify-content-center">
            <button onClick={() => setSubmitted(false)} className="btn btn-outline-primary" > Try Again </button>
            <Link to={ROUTES.LOGIN} className="btn btn-primary"> Back to Login </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="logo-container">
        <img src="/assets/images/logo.png" alt="Company Logo" className="logo" />
      </div>
      
      <div className="text-center mb-4">
        <h3>Forgot Password?</h3>
        <p className="text-muted"> Enter your email address and we'll send you a link to reset your password. </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <FormField id="email" name="email" type="email" label="Email Address" placeholder="Enter your email address"
          value={email} onChange={handleChange} required disabled={loading} autoComplete="email" />

        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading} >
          {loading ? ( <LoadingSpinner size="sm" text="Sending..." /> ) : ( 'Send Reset Link' )}
        </button>
      </form>

      <div className="text-center">
        <Link to={ROUTES.LOGIN} className="text-decoration-none"> Back to Login </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;