const mysql = require('mysql2');
const inquirer = require('inquirer');// inquirer module for prompting user 


const db = mysql.createConnection(						//creating the connection here
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: 'Arzamas16$2023',
    database: 'company_db'
  }
);

    //{name: 'ROLE_NAME',
    //message: 'Enter Name Of New Role',
    //type: 'input',
    //when: (answers) => answers.DO_WHAT === 'Add Role'},
    //{name: 'ROLE_SALARY',
    //message: 'What is the salary of the role',
    //type: 'input',
    //when: (answers) => answers.DO_WHAT === 'Add Role'},
    //{name: 'WHAT_DEPARTMENT_ROLE',
    //message: 'Which department does the role belong to?',
    //type: 'list', choices: [`SELECT * FROM department`], // THIS NEEDS TO HAVE THE LIST OF DEPARTMENTS FROM THE DEPARTMENT TABLE !!!
    //when: (answers) => answers.DO_WHAT === 'Add Role'}]
    /////////////////////////////////////////////////////////////

    db.connect((error) => {
      if (error) {
        console.error('Error connecting to the database:', error);
        return;
      }
    
      console.log('Connected to the Employee database.');
    
      promptQuestions(); // Call the function to start prompting the user
    });

    function promptQuestions() {
      inquirer
        .prompt([
          {
            name: 'DO_WHAT',
            message: 'What would you like to do?',
            type: 'list',
            choices: [
              'View Departments',
              'View Roles',
              'View Employees',
              'Add Department',
              'Add Role',
              'Add Employee',
              'Update Employee Role',
              'Quit',
            ],
          },
        ])
        .then((answers) => {
          switch (answers.DO_WHAT) {
            case 'View Departments':
              viewDepartments();
              break;
            case 'View Roles':
              viewRoles();
              break;
            case 'View Employees':
              viewEmployees();
              break;
            case 'Add Department':
              addDepartment();
              break;
            case 'Add Role':
              //addRole();
              break;
            case 'Add Employee':
              addEmployee();
              break;
            case 'Update Employee Role':
              updateEmployeeRole();
              break;
            case 'Quit':
              console.log('Exiting the program...');
              // End database connection
              db.end();
              break;
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

  
function viewDepartments(){
db.query(`SELECT * FROM department;`, (err, result) => {
  if (err) {
    console.error('Error viewing employees:', err);
    promptMainMenu();
    return;
  }
  console.table(result);
  promptQuestions();
});
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'DEPARTMENT_NAME',
        message: 'Enter Name Of New Department',
        type: 'input',
      }
    ])
    .then((answers) => {
      db.query(`INSERT INTO department (name) VALUES (?);`, [answers.DEPARTMENT_NAME], (err, result) => {
        if (err) {
          console.error(err);
          promptMainMenu();
          return;
        } else if (result) {
          console.log('Added department...');
          promptQuestions();
        }
      });
    });
}

function viewRoles(){
  db.query(`SELECT * FROM role;`, (err, result) => {
    if(err){
      console.log(err)
    }else if (result){
      console.log('Viewing Roles..');
      console.table(result);
      promptQuestions();
    }
  })
}

    // Function to view all employees
function viewEmployees() {
  console.log('GRabbing employee details');
  db.query(`
  SELECT employee.sid, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_id
  FROM employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.sid
`, (err, results) => {
    if (err) {
      console.error('Error viewing employees:', err);
      promptMainMenu();
      return;
    }
    console.table(results);
    promptQuestions();
  });
}
//////////////////////////////////////
//add employee function
function addEmployee() {
  const roleQuery = 'SELECT title FROM role';
  const managerQuery = 'SELECT CONCAT(first_name, " ", last_name) AS manager, id FROM employee WHERE manager_id IS NULL';

  db.query(roleQuery, (roleErr, roleResults) => {
    if (roleErr) {
      console.error('Error fetching roles:', roleErr);
      promptQuestions();
      return;
    }

    const roleChoices = roleResults.map((row) => row.title);

    db.query(managerQuery, (managerErr, managerResults) => {
      if (managerErr) {
        console.error('Error fetching managers:', managerErr);
        promptQuestions();
        return;
      }

      const managerChoices = managerResults.map((row) => ({
        name: row.manager,
        value: row.id,
      }));

      inquirer
        .prompt([
          {
            name: 'FIRST_NAME',
            message: "What is the employee's first name",
            type: 'input',
          },
          {
            name: 'LAST_NAME',
            message: "What is the employee's last name",
            type: 'input',
          },
          {
            name: 'EMPLOYEE_ROLE',
            message: "What is the employee's role",
            type: 'list',
            choices: roleChoices,
          },
          {
            name: 'EMPLOYEE_MANAGER',
            message: "Select a manager",
            type: 'list',
            choices: managerChoices,
          },
        ])
        .then((answers) => {
          db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [answers.FIRST_NAME, answers.LAST_NAME, answers.EMPLOYEE_ROLE, answers.EMPLOYEE_MANAGER], (err) => {
            if (err) {
              console.error('Error Adding employee:', err);
              promptQuestions();
              return;
            }
            console.log('Employee Added successfully!');
            promptQuestions();
          });
          })
          .catch((error) => {
          console.error('Error:', error);
          });
    });
  });
}

////////////////////////////////////////update employee function here
function updateEmployeeRole(){
  inquirer
  .prompt([{
    type: 'input',
    name: 'employeeId',
    message: 'Enter the ID of the employee you want to update:',
    validate: (value) => !isNaN(parseInt(value)),
  },
  {
    type: 'input',
    name: 'roleId',
    message: 'Enter the new role ID for the employee:',
    validate: (value) => !isNaN(parseInt(value)),
  },])
  .then((answers) => {
    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.employeeId, answers.roleId], (err) => {
      if (err) {
        console.error('Error Updating role:', err);
        promptQuestions();
        return;
      }
      console.log('Role Updated successfully!');
      promptQuestions();
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}