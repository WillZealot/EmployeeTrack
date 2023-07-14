DROP DATABASE IF EXISTS company_db; -- deleted existing database of name company_db

CREATE DATABASE company_db; -- creates new database with name company_db

USE company_db;   -- selects company_db database for use
-- creating a department table with an id and name
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);
-- creating a role table with the department_id being linked to the department tables id
CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
-- creating an employee table with the role_id being linked to the role table id
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT REFERENCES employee(id) ON DELETE SET NULL,
  FOREIGN KEY (role_id) REFERENCES role(id)
);-- on delete of manager roll it will set the value to null