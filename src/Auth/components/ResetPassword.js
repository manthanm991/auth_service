import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../utils/constants';
import FormField from '../../components/common/FormField';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../assets/css/auth.css';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Reset failed');
      }

      toast.success('Password has been reset successfully!');
      setSubmitted(true);

      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="logo-container mb-4">
        <img src="/assets/images/logo.png" alt="Company Logo" className="logo" />
      </div>

      <h3 className="text-center mb-3">Reset Your Password</h3>

      {submitted ? (
        <div className="text-center">
          <p className="text-success">🎉 Your password has been updated.</p>
          <p className="text-muted">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormField
            id="password"
            name="password"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <FormField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" text="Resetting..." /> : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}