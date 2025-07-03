export const useRecaptcha = () => {
  const getToken = async (action = 'submit') => {
    if (!window.grecaptcha) throw new Error("reCAPTCHA not loaded");
    return await window.grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_SITE_KEY, { action });
  };
  return { getToken };
};