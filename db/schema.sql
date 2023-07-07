DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (id, name)
id INT PRIMARY KEY,
name VARCHAR(30);

CREATE TABLE role (id,title,salary,department_id)
id INT PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department_id INT;

CREATE TABLE employee(id,first_name,last_name,role_id,manager_id)
id INT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
--add the delete if no manager thing here,
;