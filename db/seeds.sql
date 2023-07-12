INSERT INTO department (name) -- department table insert
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal Team');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Person',80000.00, 1),
    ('Lead Engineer',150000.00, 2),
    ('Software Engineer',120000.00, 2),
    ('Legal Team Lead',250000.00, 4),
    ('Lawyer',190000.00, 4),
    ('Accountant',125000.00, 3),
    ('Account Manager',160000.00, 3),
    ('Sales Lead',100000.00, 1);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Smith', 8, 2),
    ('Jane', 'Doe', 1, 1),
    ('Alex', 'Eubank', 2, NULL),
    ('Chris', 'Bumstead', 3, 2),
    ('Arnold', 'Schwarzenegger', 4, 2),
    ('Ronnie', 'Coleman', 5, 5),
    ('Jay', 'Cutler', 6, 8),
    ('Lou', 'Ferrigno', 7, 2);