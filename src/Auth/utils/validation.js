import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

export const isValidEmail = (email) => {return VALIDATION_RULES.EMAIL_REGEX.test(email);};

export const isValidPassword = (password) => {return password && password.length >= VALIDATION_RULES.MIN_PASSWORD_LENGTH;};

export const isStrongPassword = (password) => {return VALIDATION_RULES.STRONG_PASSWORD_REGEX.test(password);};

export const doPasswordsMatch = (password, confirmPassword) => {return password === confirmPassword;};

export const isValidName = (name) => {return name && name.trim().length >= VALIDATION_RULES.MIN_NAME_LENGTH;};

export const validateLoginForm = (credentials) => {
  const errors = [];

  if (!credentials.email) {errors.push(ERROR_MESSAGES.EMAIL_REQUIRED);}
  else if (!isValidEmail(credentials.email)) {errors.push(ERROR_MESSAGES.INVALID_EMAIL);}

  if (!credentials.password) {errors.push(ERROR_MESSAGES.PASSWORD_REQUIRED);}
  else if (!isValidPassword(credentials.password)) {errors.push(ERROR_MESSAGES.PASSWORD_MIN_LENGTH);}

  return errors;
};

export const validateSignupForm = (userData) => {
  const errors = [];

  if (!userData.name || !isValidName(userData.name)) {errors.push(ERROR_MESSAGES.NAME_MIN_LENGTH);}

  if (!userData.email) {errors.push(ERROR_MESSAGES.EMAIL_REQUIRED);}
  else if (!isValidEmail(userData.email)) {errors.push(ERROR_MESSAGES.INVALID_EMAIL);}
  
  if (!userData.password) {errors.push(ERROR_MESSAGES.PASSWORD_REQUIRED);}
  else if (!isValidPassword(userData.password)) {errors.push(ERROR_MESSAGES.PASSWORD_MIN_LENGTH);}
  
  if (userData.confirmPassword !== undefined && !doPasswordsMatch(userData.password, userData.confirmPassword)) { errors.push(ERROR_MESSAGES.PASSWORDS_NO_MATCH); }

  return errors;
};

export const validateField = (fieldName, value, rules = {}) => {
  const errors = [];

  if (rules.required && !value) {
    errors.push(`${fieldName} is required.`);
    return errors;
  }

  if (rules.minLength && value.length < rules.minLength) { errors.push(`${fieldName} must be at least ${rules.minLength} characters long.`); }
  if (rules.email && !isValidEmail(value)) { errors.push(`Please enter a valid ${fieldName.toLowerCase()}.`); }
  if (rules.match && value !== rules.match) { errors.push(`${fieldName} does not match.`); }

  return errors;
};