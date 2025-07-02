import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
        <img src="/assets/images/logo.png" alt="Logo" height="30" className="me-2" /> Auth Service
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/"> Home </Link></li>
            {isAuthenticated && user?.isAdmin && (
              <li className="nav-item"><Link className="nav-link" to="/dashboard"> Dashboard </Link></li>
            )}
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" >
                  Welcome, {user?.name} {user?.isAdmin && ( <span className="badge bg-success ms-2">Admin</span> )}
                  </Link>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/profile"> Profile </Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}