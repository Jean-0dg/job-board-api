//Imports 
require('dotenv').config();
const express = require('express');
const app = express();
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');

//Middleware
app.use(express.json());
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);


//Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});


//Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running`);
});
