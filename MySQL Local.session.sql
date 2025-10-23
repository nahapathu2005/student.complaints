CREATE DATABASE complaint;

USE complaint;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  roll_no VARCHAR(50),
  department VARCHAR(100),
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  complaint_type VARCHAR(100),
  complaint_text TEXT,
  status VARCHAR(20) DEFAULT 'Pending',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id)
);
