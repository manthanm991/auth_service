const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyRecaptcha } = require('../utils/recaptcha');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.createuser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }

    const { name, email, password, recaptchaToken } = req.body;
    try {
        const recaptchaRes = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaRes.success || recaptchaRes.score < 0.5) {
            return res.status(403).json({ error: 'reCAPTCHA verification failed' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to verify reCAPTCHA' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) { return res.status(400).json({ error: 'User already exists' }); }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        const payload = { user: { id: savedUser._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

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
    if (!errors.isEmpty()) { return res.status(400).json({ error: errors.array() }); }

    const { email, password, recaptchaToken } = req.body;
    try {
        const recaptchaRes = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaRes.success || recaptchaRes.score < 0.5) {
            return res.status(403).json({ error: 'reCAPTCHA verification failed' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to verify reCAPTCHA' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) { return res.status(404).json({ error: 'User not found' }); }

        if (user.googleId && !user.password) {
            return res.status(400).json({ 
                error: 'Please sign in with Google instead' 
            });
        }
        
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
    } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.json({ success: true, user });
    } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
};

exports.googleCallback = async (req, res) => {
  try {
    const { credential } = req.body;
    
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID, });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });
    
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture;
        await user.save();
      }
    } else {
      user = new User({
        name: name,
        email: email,
        googleId: googleId,
        profilePicture: picture,
        isEmailVerified: true,
      });
      await user.save();
    }
    
    const jwtPayload = { user: { id: user._id } };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
    
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
};