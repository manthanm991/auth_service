import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

const Unauthorized = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const handleGoBack = () => { navigate(-1); };
  const getHomeRoute = () => {
    if (!isAuthenticated) return ROUTES.HOME;
    return user?.isAdmin ? ROUTES.DASHBOARD : ROUTES.HOME;
  };

  return (
    <div className="unauthorized-container">
      <div className="text-center">
        <div className="mb-4">
          <h1 className="display-1 fw-bold text-danger">403</h1>
          <h2 className="mb-3">Access Denied</h2>
          <p className="lead text-muted mb-4"> You don't have permission to access this page.</p>
        </div>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <button onClick={handleGoBack} className="btn btn-outline-primary" > Go Back </button>
          <Link to={getHomeRoute()} className="btn btn-primary" > Go Home </Link>
          {!isAuthenticated && ( <Link to={ROUTES.LOGIN} className="btn btn-success" > Login </Link> )}
        </div>

        <div className="mt-4">
          <small className="text-muted"> If you believe this is an error, please contact support. </small>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;