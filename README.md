ß# Job Board Backend API 

A RESTful API for a job board. 
Backend for a job board-type website. 
Display of technologies I learned.

## Features
- User authentication (sign up, login, JWT tokens)
- Create/read/update/delete job postings
- Search jobs by title, location, salary range
- Pagination (10 jobs per page)
- Error handling and input validation

## Technologies
- Node.js
- Express.js
- PostgreSQL 

## Setup
- Clone repo and install dependencies: 
    - git clone https://github.com/Jean-0dg/job-board-api
    - cd job-board-api
    - npm install
- Set up environment variables:
    - Create a `.env` file in the root directory:
        - DATABASE_URL=postgresql://username:password@localhost:5432/job_board_db
        - JWT_SECRET=your_jwt_secret_key
        - PORT=3000
- Set up the database:
    - psql -U postgres
    - CREATE DATABASE job_board_db;
    - Run SQL schema file
- Start the server: 
    - npm start 

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Jobs
- `GET /api/jobs` - Get all jobs (with search and pagination)
- `GET /api/jobs/:id` - Get a single job
- `POST /api/jobs` - Create a new job (requires authentication)
- `PUT /api/jobs/:id` - Update a job (requires authentication)
- `DELETE /api/jobs/:id` - Delete a job (requires authentication)

## Author
Jean Ouedraogo - [GitHub]

## Links
[GitHub]: https://github.com/Jean-0dg
