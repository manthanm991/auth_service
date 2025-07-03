import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { validateSignupForm } from '../utils/validation';
import { ROUTES } from '../utils/constants';
import FormField from '../../components/common/FormField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../assets/css/auth.css';
import { useRecaptcha } from '../hooks/useRecaptcha';

const Signup = () => {
  const [userData, setUserData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { signup, loading, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const { getToken } = useRecaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const validationErrors = validateSignupForm(userData);
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      const recaptchaToken = await getToken('createuser');
      const result = await signup({ ...userData, recaptchaToken: recaptchaToken });

      if (result.success) {
        if (result.requiresLogin) {
          navigate(ROUTES.LOGIN);
        } else {
          const redirectPath = getRedirectPath(result.user);
          navigate(redirectPath);
        }
      } else {
        toast.error(result.message || 'Signup failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) { setFieldErrors(prev => ({ ...prev, [name]: null })); }
  };

  return (
    <div id="signupPage" className="create-account-container">
      <div className="logo-container">
        <img src="/assets/images/logo.png" alt="Company Logo" className="logo" />
      </div>

      <form onSubmit={handleSubmit} id="signupForm" data-action="createuser">
        <FormField id="name" name="name" type="text" label="Full Name" placeholder="Enter your full name" value={userData.name} onChange={handleChange} required disabled={loading} autoComplete="name" minLength={2} error={fieldErrors.name} />

        <FormField id="email" name="email" type="email" label="Email Address" placeholder="Enter valid email" value={userData.email} onChange={handleChange} required disabled={loading} autoComplete="email" error={fieldErrors.email} />

        <FormField id="password" name="password" type="password" label="Password" placeholder="Password (min 8 characters)" value={userData.password} onChange={handleChange} required disabled={loading} autoComplete="new-password" minLength={8} error={fieldErrors.password} />

        <FormField id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" placeholder="Confirm your password" value={userData.confirmPassword} onChange={handleChange} required disabled={loading} autoComplete="new-password" minLength={8} error={fieldErrors.confirmPassword} />

        <button type="submit" className="btn btn-primary w-100" disabled={loading} >
          {loading ? (<LoadingSpinner size="sm" text="Creating Account..." />) : ('Create Account')}
        </button>
      </form>
      <hr />
      <div className="text-center mt-3">
        <Link to={ROUTES.LOGIN} className="text-decoration-none">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;