const viewEmployees =  'SELECT * FROM `employee` RIGHT JOIN role ON role.id = employee.role_id';


module.exports = viewEmployees;