const express = require('express');
const router = express.Router();
const db = require('../db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

// Regitration validation
const registrationSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
});
// Login validation
const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password required'),
});

// Registration route
router.post('/register', async (req, res) => {

    // Input validation
    const result = registrationSchema.safeParse(req.body);
    if (!result.success) {
        let errorMsg = 'Invalid input';
        if (result.error && result.error.errors) {
            errorMsg = result.error.errors.map(e => e.message).join(', ');
        }
        return res.status(400).json({ error: errorMsg });
    }
    const { email, password, name } = result.data;

    try {
        // Password hash
        const password_hash = await bcrypt.hash(password, 10);  // 10 salt rounds for security
        // Store the user
        const userResult = await db.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, password_hash, name]
        );
        // Return user info 
        res.status(201).json(userResult.rows[0]);
    } catch (err) {
        // Duplicate emails handler
        if (err.code === '23505') { // unique violation
            return res.status(400).json({ error: 'Email already taken' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login route
router.post('/login', async (req, res) => {

    // Input validation
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        let errorMsg = 'Invalid input';
        if (result.error && result.error.errors) {
            errorMsg = result.error.errors.map(e => e.message).join(', ');
        }
        return res.status(400).json({ error: errorMsg });    
    }
    const { email, password } = result.data;

    try {
        // User search with email
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Password validation
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // JWT token generation
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });

        // Respond with token & user info
        res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
