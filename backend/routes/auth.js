const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Register route
router.post('/register', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ msg: 'User registered' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login route

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Validate password
        if (!user.comparePassword(password)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Set session or token
        req.session.user = user; // Save user information in the session
        return res.status(200).json({ success: true ,userId: user._id });

    } catch (error) {
        console.error('Login error:', error); // Log the detailed error
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});
// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ msg: 'Error logging out' });
        }
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ msg: 'User logged out' });
    });
});

module.exports = router;
