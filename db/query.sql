SELECT * FROM department; --selects all departments

SELECT * FROM ROLE; --selects all roles

SELECT * FROM employee; --selects all employees

SELECT *    -- SELECTS ALL EMPLOYEES WITH THE ROLES AND SALARIES AND THE DEPARTMENT ID
FROM employee
RIGHT JOIN role ON role.id = employee.role_id;

INSERT INTO department (name) --departments insert if you want to add a department
VALUES
    ('');

INSERT INTO role (title, salary, department_id) -- inserting a new role
VALUES
    ('', , );

INSERT INTO employee (first_name, last_name, role_id, manager_id) -- inserting a new employee for functions.
VALUES
    ('', '', , ),