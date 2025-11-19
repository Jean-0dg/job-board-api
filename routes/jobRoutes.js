//Imports
const express = require('express');
const router = express.Router();
const db = require('../db'); 
const authenticateToken = require('../middleware/authMiddleware');
const { z } = require('zod');

//Job validation
const jobSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    salary_min: z.number().min(0, 'Salary must be a positive number'),
    salary_max: z.number().min(0, 'Salary must be a positive number'),
});

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
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Get a single job  
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
        if (!result.rows.length) {
            return res.status(404).json({ error: 'Job not found' }); 
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

//Create a new job
router.post('/', authenticateToken, async (req, res) => {
    
    // User Authorization
    const user_id = req.user.userId;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    //Testing 
    console.log('Decoded JWT payload:', user_id);

    // Input validation
    const validationResult = jobSchema.safeParse(req.body);
    if (!validationResult.success) {
        let errorMsg = 'Invalid input';
        if (validationResult.error && validationResult.error.errors) {
            errorMsg = validationResult.error.errors.map(e => e.message).join(', ');
        }
        return res.status(400).json({ error: errorMsg });
    }
    const { title, description, location, salary_min, salary_max } = validationResult.data;

    // Create the job
    try {
        const result = await db.query(
            'INSERT INTO jobs (title, description, location, salary_min, salary_max, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, location, salary_min, salary_max, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Update a job
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // User Authorization    
    const result = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (!result.rows.length) {
        return res.status(404).json({ error: 'Job not found' }); 
    }
    const job = result.rows[0];
    if(job.user_id !== req.user.userId){
        return res.status(403).json({ error: 'You are not authorized to update this job' });
    } 

    // Input validation
    const validationResult = jobSchema.safeParse(req.body);
    if (!validationResult.success) {
        let errorMsg = 'Invalid input';
        if (validationResult.error && validationResult.error.errors) {
            errorMsg = validationResult.error.errors.map(e => e.message).join(', ');
        }
        return res.status(400).json({ error: errorMsg });
    }
    const { title, description, location, salary_min, salary_max } = validationResult.data;

    // Update the job
    try {
        const updatedJob = await db.query(
            'UPDATE jobs SET title = $1, description = $2, location = $3, salary_min = $4, salary_max = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [title, description, location, salary_min, salary_max, id]
        );
        res.status(200).json(updatedJob.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Delete a job
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    // User Authorization    
    const result = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (!result.rows.length) {
        return res.status(404).json({ error: 'Job not found' }); 
    }
    const job = result.rows[0];
    if(job.user_id !== req.user.userId){
        return res.status(403).json({ error: 'You are not authorized to delete this job' });
    }

    // Delete the job
    try {
        await db.query('DELETE FROM jobs WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

module.exports = router;