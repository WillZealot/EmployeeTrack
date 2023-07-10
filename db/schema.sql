DROP DATABASE IF EXISTS company_db; -- deleted existing database of name company_db

CREATE DATABASE company_db; -- creates new database with name company_db

USE company_db;   -- selects company_db database for use

CREATE TABLE department ( -- creating a department table with an id and name
id INT PRIMARY KEY,
name VARCHAR(30));

CREATE TABLE role ( -- creating a role table with the department_id being linked to the department tables id
id INT PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id)
REFERENCES department(id));

CREATE TABLE employee( -- creating an employee table with the role_id being linked to the role table id
id INT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
FOREIGN KEY (role_id)
REFERENCES role(id),

FOREIGN KEY (manager_id)
REFERENCES employee(id)
ON DELETE SET NULL
); -- on delete of manager roll it will set the value to null