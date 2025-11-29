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
    salary_min: z.coerce.number().min(0, 'Salary must be a positive number'),
    salary_max: z.coerce.number().min(0, 'Salary must be a positive number'),
}).refine((data) => data.salary_max >= data.salary_min, {
    message: "Maximum salary must be at least equal to minimum salary",
    path: ["salary_max"],
});

//Get all jobs
router.get('/', async (req, res) => {
    const { search } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;
    
    try {
        let baseQuery = 'SELECT * FROM jobs';
        const params = [];
        let paramIndex = 1;

        if (search) {
            baseQuery += ` WHERE title ILIKE $${paramIndex} OR description ILIKE $${paramIndex}`;
            params.push(`%${search}%`);
            paramIndex += 1;
        }

        baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const result = await db.query(baseQuery, params);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Create a new job
router.post('/', authenticateToken, async (req, res) => {
    
    // User Authorization
    const user_id = req.user.userId;
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
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

    // Create the job
    try {
        const result = await db.query(
            'INSERT INTO jobs (title, description, location, salary_min, salary_max, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, location, salary_min, salary_max, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

module.exports = router;