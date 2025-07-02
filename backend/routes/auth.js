const express = require('express');
const router = express.Router();
const { createuser, login, getAllUsers, getUser } = require('../controllers/authControllers');
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

module.exports = router;