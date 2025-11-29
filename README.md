# Job Board Backend API 

A RESTful API for a job board. 
Backend for a job board-type website. 
Display of skillset.

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

## Deployment
The API is deployed on Render with a Neon PostgreSQL database.
- **Base URL**: `[INSERT_DEPLOYED_URL_HERE]`
- **Test Users**:
    - Admin: `admin@job.ap` / `password123`
    - Test: `test@job.ap` / `password123`

## Local Development Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/Jean-0dg/job-board-api
   cd job-board-api
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/job_board_db
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

3. **Database Setup**
   Ensure PostgreSQL is running, then execute:
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE job_board_db;"
   
   # Run schema and seed
   psql -U postgres -d job_board_db -f schema.sql
   psql -U postgres -d job_board_db -f seed.sql
   ```

4. **Start the Server**
   ```bash
   # Development (with auto-reload)
   npm run dev
   
   # Production
   npm start
   ``` 


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

[GitHub]: https://github.com/Jean-0dg
