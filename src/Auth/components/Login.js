import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { validateLoginForm } from "../utils/validation";
import { ROUTES } from "../utils/constants";
import FormField from "../../components/common/FormField";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useRecaptcha } from "../hooks/useRecaptcha";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import "../../assets/css/auth.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, loading, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const { getToken } = useRecaptcha();
  const { renderGoogleButton } = useGoogleAuth();

  useEffect(() => {
    const timer = setTimeout(() => { renderGoogleButton("googleSignInButton"); }, 100);
    return () => clearTimeout(timer);
  }, [renderGoogleButton]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const validationErrors = validateLoginForm(credentials);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    try {
      const recaptchaToken = await getToken("login");
      const result = await login({ ...credentials, recaptchaToken: recaptchaToken, });

      if (result.success) { navigate(getRedirectPath(result.user)); }
      else { toast.error(result.message || "Login failed"); }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) { setFieldErrors((prev) => ({ ...prev, [name]: null })); }
  };

  return (
    <React.Fragment>
      <div id="loginPage" className="login-container">
        <div className="logo-container">
          <img src="/assets/images/logo.png" alt="Company Logo" className="logo" />
        </div>

        <form onSubmit={handleSubmit} id="loginForm" data-action="login">
          <FormField id="email" name="email" type="email" label="Email Address" placeholder="Enter valid email" value={credentials.email} onChange={handleChange} required disabled={loading} autoComplete="email" error={fieldErrors.email} />

          <FormField id="password" name="password" type="password" label="Password" placeholder="Password" value={credentials.password} onChange={handleChange} required disabled={loading} autoComplete="current-password" minLength={8} error={fieldErrors.password} />

          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading} >
            {loading ? (<LoadingSpinner size="sm" text="Logging in..." />) : ("Login")}
          </button>

          <div className="text-center mb-3">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-decoration-none"> Forgot Password? </Link>
          </div>
        </form>
        <hr />
        <div className="text-centet mt-3">
          <button id="googleSignInButton" style={{ width: "70%", outline: "none", boxShadow: "none", borderRadius: "8px", border: "none", }} >
            Continue with Google
          </button>
        </div>

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link to={ROUTES.SIGNUP} className="text-decoration-none"> Create account </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;