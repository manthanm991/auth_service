import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_ENDPOINTS, ROUTES } from '../utils/constants';
import { useAuth } from './useAuth';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export const useGoogleAuth = () => {
    const navigate = useNavigate();
    const { setAuthData } = useAuth();

    const handleGoogleCallback = useCallback(async (response) => {
        try {
            const res = await fetch(API_ENDPOINTS.GOOGLE_CALLBACK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();

            if (data.success) {
                setAuthData(data.user, data.token);
                const redirectPath = data.user?.isAdmin ? ROUTES.DASHBOARD : ROUTES.HOME;
                navigate(redirectPath);
                toast.success(`Welcome, ${data.user.name}!`);
            } else {
                toast.error(data.message || 'Google Sign-in failed');
            }
        } catch (error) {
            toast.error('Error during Google Sign-In. Try again later!');
        }
    }, [navigate, setAuthData]);

    useEffect(() => {
        if (window.google && GOOGLE_CLIENT_ID) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCallback,
            });
        }
    }, [handleGoogleCallback]);


    const renderGoogleButton = (elementId) => {
        if (!window.google) {
            console.warn('Google Sign-In not loaded');
            return;
        }

        if (!GOOGLE_CLIENT_ID) {
            console.warn('Google Client ID not configured');
            return;
        }

        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with id '${elementId}' not found`);
            return;
        }

        try {
            window.google.accounts.id.renderButton(element, {
                theme: 'outline',
                size: 'large',
                text: 'continue_with'
            });
        } catch (error) {
            console.error('Error rendering Google button:', error);
        }
    };

    return { renderGoogleButton };
};