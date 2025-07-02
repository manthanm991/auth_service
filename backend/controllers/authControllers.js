const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.createuser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }

    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) { return res.status(400).json({ error: 'User already exists' }); }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        const payload = { user: { id: savedUser._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {return res.status(400).json({ error: errors.array() });}

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) { return res.status(404).json({ error: 'User not found' }); }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { return res.status(401).json({ error: 'Invalid credentials' }); }

        const payload = { user: { id: user._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (err) {res.status(500).json({ error: 'Internal Server Error' });}
};

exports.getUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password');
      res.json({ success: true, user });
    } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
};