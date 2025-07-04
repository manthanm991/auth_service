const express = require('express');
const router = express.Router();
const { createuser, login, getAllUsers, getUser, googleCallback, forgotPassword, resetPassword } = require('../controllers/authControllers');
const verify = require('../middlewares/authMiddleware');
const { body } = require("express-validator");

router.post('/createuser', [
    body("name", "Name must be at least 3 characters long").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 8 characters long, include an uppercase letter and a number")
        .isLength({ min: 8 })
        .matches(/^(?=.*[A-Z])(?=.*\d)/),
], createuser);

router.post('/login', [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password is required").exists()
], login);

router.get('/users', verify, getAllUsers);

router.get('/user', verify, getUser);

router.post('/callback', googleCallback);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

module.exports = router;