-- Seed users
INSERT INTO users (name, email, password_hash, created_at)
VALUES
  ('Admin User', 'admin@job.ap', '$2b$10$Z/yY6PXWRqVnbWf92hqEkO9.5KpYf/P4PUaWEyPV8KpWqv0.zo8Iu', NOW()),
  ('Test User', 'test@job.ap', '$2b$10$JyTMB6sV0h.9LFm3GjF1RO.GGyPRsIwXCharWPa4sO.cOVcmeq3Zy', NOW())
ON CONFLICT (email) DO NOTHING;

-- Seed jobs
INSERT INTO jobs (title, description, location, salary_min, salary_max, user_id, created_at)
VALUES
  ('Backend Developer (Node.js)', 'Build and maintain REST APIs using Node.js, Express, and PostgreSQL.', 'Ottawa, ON', 75000, 95000, 1, NOW()),
  ('Full-Stack Developer (React/Node)', 'End-to-end feature development with React on the frontend and Node on the backend.', 'Remote', 80000, 105000, 1, NOW()),
  ('Junior Frontend Developer', 'Work on UI components, accessibility, and performance in React.', 'Montreal, QC', 60000, 75000, 1, NOW()),
  ('DevOps Engineer', 'CI/CD pipelines, containerization, and cloud infrastructure management.', 'Toronto, ON', 90000, 120000, 2, NOW()),
  ('Data Engineer', 'Design ETL pipelines and manage data warehouses.', 'Vancouver, BC', 95000, 125000, 2, NOW()),
  ('Mobile Developer (Flutter)', 'Develop cross-platform mobile apps with Flutter and Dart.', 'Remote', 70000, 90000, 1, NOW()),
  ('AI Engineer (LLM Apps)', 'Build LLM-powered applications, APIs, and tools.', 'Remote', 100000, 130000, 2, NOW()),
  ('QA Engineer', 'Automated and manual testing of web applications.', 'Calgary, AB', 65000, 80000, 1, NOW()),
  ('Product Manager (Tech)', 'Coordinate between engineering and design to deliver product features.', 'Ottawa, ON', 90000, 115000, 2, NOW()),
  ('Intern Software Developer', 'Assist in building features and fixing bugs in a modern web stack.', 'Toronto, ON', 40000, 50000, 1, NOW());
