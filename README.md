# Job Board Backend API 

A RESTful API for a job board. 
Backend for a job board-type website. 
Display of skillset.

## Features
- User authentication (sign up, login, JWT tokens)
- Create/read/update/delete job postings
- Search jobs by title/description (with query parameter)
- Pagination (10 jobs per page)
- Error handling and input validation

## Technologies
- Node.js
- Express.js
- PostgreSQL 

## Deployment
The API is deployed on Render with a Neon PostgreSQL database.
- **Base URL**: `https://job-board-api-31z1.onrender.com`
- **Test Users**:
    - Admin: `admin@job.ap` / `password123!`
    - Test: `test@job.ap` / `password123!`

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
- `POST /api/auth/register` - Register a new user and get id
- `POST /api/auth/login` - Login and receive JWT token

### Jobs
- `GET /api/jobs` - Get all jobs (with search and pagination)
- `GET /api/jobs/:id` - Get a single job by id
- `POST /api/jobs` - Create a new job (requires authentication)
- `PUT /api/jobs/:id` - Update a job (requires authentication)
- `DELETE /api/jobs/:id` - Delete a job (requires authentication)

## Testing the API 

Base URL (live): https://job-board-api-31z1.onrender.com

### 1. Register and Login

- POST https://job-board-api-31z1.onrender.com/api/auth/register
    Body:
    ```json
    {
        "name": "Your Name",
        "email": "your.email@example.com",
        "password": "password123"
    }
    ```
- POST https://job-board-api-31z1.onrender.com/api/auth/login
    Body:
    ```json
    {
        "email": "your.email@example.com",
        "password": "password123"
    }
    ```
    Response: (Copy your token for routes that require authentication.)
    ```json
    {
        "token": "your.jwt.token" 
    }
    ```
### 2. Create a Job
- POST https://job-board-api-31z1.onrender.com/api/jobs
    Authorization: 
        Auth type: Bearer token. Paste your token in the Authorization tab.
    Body:
    ```json
    {
        "title": "Software Engineer",
        "description": "Build and maintain REST APIs using Node.js, Express, and PostgreSQL.",
        "location": "Ottawa, ON",
        "salary_min": 75000,
        "salary_max": 95000
    }    
    ``` 
### 3. Get a Job
- GET https://job-board-api-31z1.onrender.com/api/jobs/:id (Example: /api/jobs/1)
    Params:
        id: job id

### 4. Get All Jobs (with search and pagination)
Note: the deployed API expects a trailing slash for this endpoint.
- GET https://job-board-api-31z1.onrender.com/api/jobs/ (Example: /api/jobs/?search=dev&page=1&limit=5)
    Params:
        search: search query
        page: page number
        limit: number of jobs per page

### 5. Update a Job
- PUT https://job-board-api-31z1.onrender.com/api/jobs/:id (Example: /api/jobs/1)
    Params:
        id: job id
    Authorization: 
        Auth type: Bearer token. Paste your token in the Authorization tab.
    Body:
    ```json
    {
        "description": "Build and maintain REST APIs using Node.js, Express, and PostgreSQL."
    }
    ```

### 6. Delete a Job
- DELETE https://job-board-api-31z1.onrender.com/api/jobs/:id (Example: /api/jobs/1)   
    Params:
        id: job id
    Authorization: 
        Auth type: Bearer token. Paste your token in the Authorization tab. 

## Author
Jean Ouedraogo - [GitHub]
contact@jeanouedraogo.dev 

[GitHub]: https://github.com/Jean-0dg
