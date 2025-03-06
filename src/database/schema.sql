
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  class VARCHAR(20) NOT NULL,
  section VARCHAR(10) NOT NULL,
  rollNumber VARCHAR(20) NOT NULL,
  parentName VARCHAR(100) NOT NULL,
  contactNumber VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  joinDate DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accountants table
CREATE TABLE IF NOT EXISTS accountants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255),
  joinDate DATE,
  isActive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create academic_sessions table
CREATE TABLE IF NOT EXISTS academic_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  isActive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create fee_heads table
CREATE TABLE IF NOT EXISTS fee_heads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  isOneTime BOOLEAN DEFAULT TRUE,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create fee_class_mapping table for relating fee heads to classes
CREATE TABLE IF NOT EXISTS fee_class_mapping (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feeHeadId INT NOT NULL,
  classId INT NOT NULL,
  FOREIGN KEY (feeHeadId) REFERENCES fee_heads(id) ON DELETE CASCADE,
  FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_fee_class (feeHeadId, classId)
);

-- Insert initial data - academic sessions
INSERT INTO academic_sessions (name, startDate, endDate, isActive) VALUES
('2023-2024', '2023-06-01', '2024-04-30', TRUE),
('2022-2023', '2022-06-01', '2023-04-30', FALSE),
('2021-2022', '2021-06-01', '2022-04-30', FALSE);

-- Insert initial data - students
INSERT INTO students (studentId, name, class, section, rollNumber, parentName, contactNumber, email, joinDate) VALUES
('OAK2023001', 'Emily Johnson', '10', 'A', '1001', 'Michael Johnson', '(555) 234-5678', 'emily.j@example.com', '2020-06-15'),
('OAK2023002', 'Daniel Smith', '9', 'B', '902', 'Sarah Smith', '(555) 345-6789', NULL, '2021-05-20'),
('OAK2023003', 'Sophia Williams', '11', 'A', '1103', 'Robert Williams', '(555) 456-7890', 'sophia.w@example.com', '2019-06-10'),
('OAK2023004', 'Ethan Brown', '8', 'C', '804', 'Jennifer Brown', '(555) 567-8901', NULL, '2022-06-05'),
('OAK2023005', 'Olivia Davis', '12', 'B', '1205', 'James Davis', '(555) 678-9012', 'olivia.d@example.com', '2018-06-12');

-- Insert initial data - accountants
INSERT INTO accountants (name, email, phone, address, joinDate, isActive) VALUES
('Alexander Morgan', 'alex.morgan@oakridge.edu', '(555) 789-0123', '456 Finance Street, Springfield, IL', '2020-03-15', TRUE),
('Priya Sharma', 'priya.sharma@oakridge.edu', '(555) 890-1234', NULL, '2021-07-10', TRUE);

-- Insert initial data - classes
INSERT INTO classes (name, description, isActive) VALUES
('Grade 1', 'First grade elementary', TRUE),
('Grade 2', 'Second grade elementary', TRUE),
('Grade 3', 'Third grade elementary', TRUE);
