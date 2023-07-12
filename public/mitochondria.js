const viewEmployees =  `SELECT *    -- SELECTS ALL EMPLOYEES WITH THE ROLES AND SALARIES AND THE DEPARTMENT ID
    FROM employee
    RIGHT JOIN role ON role.id = employee.role_id`;


module.exports = viewEmployees;