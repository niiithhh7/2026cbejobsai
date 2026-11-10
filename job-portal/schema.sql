CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(160) NOT NULL,
  industry VARCHAR(120),
  company_size VARCHAR(60),
  founded_year INT,
  phone VARCHAR(40),
  email VARCHAR(160),
  location VARCHAR(255),
  website VARCHAR(255),
  social_links JSON,
  logo_url VARCHAR(255),
  about TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employer_id INT,
  title VARCHAR(160) NOT NULL,
  location VARCHAR(255),
  salary_range VARCHAR(100),
  job_type ENUM('Freelancer','Full-time','Part-time','Internship','Contract','Temporary') DEFAULT 'Full-time',
  industry VARCHAR(120),
  description TEXT,
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE SET NULL
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  user_id INT,
  resume_url VARCHAR(255),
  status ENUM('pending','accepted','rejected') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120),
  email VARCHAR(160),
  subject VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resume_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  file_name VARCHAR(255),
  score INT,
  summary TEXT,
  strengths JSON,
  improvements JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- seed data
INSERT INTO employers (company_name, industry, company_size, founded_year, phone, email, location, website, social_links, logo_url, about) VALUES
('TIDEL InfoTech', 'IT & ITES', '200-500', 2010, '+91 422 1234567', 'hr@tidelinfotech.com', 'TIDEL Park, Coimbatore, Tamil Nadu', 'https://tidelinfotech.example.com', '{"facebook":"#","twitter":"#","instagram":"#","linkedin":"#"}', '', 'TIDEL InfoTech is a leading IT services company based in Coimbatore, delivering software solutions across fintech, healthcare and retail.'),
('Kovai Textiles Ltd', 'Textiles', '500-1000', 1995, '+91 422 7654321', 'careers@kovaitextiles.com', 'Peelamedu, Coimbatore, Tamil Nadu', 'https://kovaitextiles.example.com', '{"facebook":"#","twitter":"#","instagram":"#","linkedin":"#"}', '', 'Kovai Textiles is one of the largest textile manufacturers in the region, exporting to over 20 countries.'),
('Ganapathy Engineering Works', 'Engineering', '50-200', 2005, '+91 422 9988776', 'jobs@gew.com', 'Ganapathy, Coimbatore, Tamil Nadu', 'https://gew.example.com', '{"facebook":"#","twitter":"#","instagram":"#","linkedin":"#"}', '', 'Ganapathy Engineering Works specializes in precision components for the automotive and industrial sectors.'),
('Singanallur Health Systems', 'Healthcare', '100-500', 2012, '+91 422 4455667', 'hr@shs.com', 'Singanallur, Coimbatore, Tamil Nadu', 'https://shs.example.com', '{"facebook":"#","twitter":"#","instagram":"#","linkedin":"#"}', '', 'Singanallur Health Systems runs multi-specialty hospitals and diagnostic centers across Coimbatore.');

INSERT INTO jobs (employer_id, title, location, salary_range, job_type, industry, description) VALUES
(1, 'Frontend Developer (React)', 'TIDEL Park, Coimbatore', '₹5,00,000 - ₹8,00,000', 'Full-time', 'IT & ITES', 'Build and maintain customer-facing React applications, collaborate with designers and backend engineers.'),
(1, 'Backend Engineer (Node.js)', 'TIDEL Park, Coimbatore', '₹6,00,000 - ₹9,50,000', 'Full-time', 'IT & ITES', 'Design and implement REST APIs, work with MySQL, own service reliability.'),
(2, 'Textile Quality Inspector', 'Peelamedu, Coimbatore', '₹2,50,000 - ₹3,50,000', 'Full-time', 'Textiles', 'Inspect fabric quality against standards, prepare quality reports.'),
(3, 'CNC Machine Operator', 'Ganapathy, Coimbatore', '₹2,00,000 - ₹3,00,000', 'Full-time', 'Engineering', 'Operate CNC machines to manufacture precision automotive components.'),
(3, 'Mechanical Design Intern', 'Ganapathy, Coimbatore', '₹10,000/month', 'Internship', 'Engineering', 'Assist senior engineers with CAD design and prototyping.'),
(4, 'Staff Nurse', 'Singanallur, Coimbatore', '₹3,00,000 - ₹4,50,000', 'Full-time', 'Healthcare', 'Provide patient care across general wards, coordinate with doctors.'),
(1, 'iOS Developer', 'Avinashi Road, Coimbatore', '₹5,50,000 - ₹8,50,000', 'Contract', 'IT & ITES', 'Develop and ship Swift-based iOS applications for enterprise clients.'),
(2, 'PHP Web Developer', 'Peelamedu, Coimbatore', '₹3,50,000 - ₹5,00,000', 'Part-time', 'Textiles', 'Maintain internal PHP-based ERP portal for the textile unit.');
