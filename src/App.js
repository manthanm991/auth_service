import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './Auth/context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './Auth/components/Login';
import Signup from './Auth/components/Signup';
import ForgotPassword from './Auth/components/ForgotPassword';
import Unauthorized from './Auth/components/Unauthorized';
import { PrivateRoute, PublicRoute, AdminRoute, ROUTES, TOAST_CONFIG } from './Auth';
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main>
                    <Routes>
                        <Route element={<PublicRoute />}>
                            <Route path={ROUTES.LOGIN} element={<Login />} />
                            <Route path={ROUTES.SIGNUP} element={<Signup />} />
                            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                        </Route>

                        <Route element={<PrivateRoute />}>
                            <Route path={ROUTES.PROFILE} element={<div className="container py-5"><h2>Profile Page</h2><p>This is a protected profile page.</p></div>} />
                        </Route>

                        <Route element={<AdminRoute />}>
                            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                        </Route>

                        <Route path={ROUTES.HOME} element={<Home />} />
                        <Route path="*" element={<Unauthorized />} />
                    </Routes>
                </main>

                <ToastContainer {...TOAST_CONFIG} />
            </Router>
        </AuthProvider>
    );
}

export default App;