//Imports
const express = require('express');
const router = express.Router();
const db = require('../db'); 
const authenticateToken = require('../middleware/authMiddleware');
const { z } = require('zod');

//Get all jobs
router.get('/', async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        let query = 'SELECT * FROM jobs';
        let params = [];
        if (search) {
            query += ' WHERE title ILIKE $1 OR description ILIKE $1';
            params = [`%${search}%`];
        }
        query += ` LIMIT ${limit} OFFSET ${offset}`;
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get a single job  
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(404).json({ error: 'Job not found' });
    }
});

//Create a new job
router.post('/', authenticateToken, async (req, res) => {
    console.log('Decoded JWT payload:', req.user.userId);
    const { title, description, location, salary_min, salary_max } = req.body;
    const user_id = req.user.userId;

    try {
        const result = await db.query(
            'INSERT INTO jobs (title, description, location, salary_min, salary_max, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, location, salary_min, salary_max, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Update a job
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    
});

//Delete a job
router.delete('/:id', async (req, res) => {

});

module.exports = router;