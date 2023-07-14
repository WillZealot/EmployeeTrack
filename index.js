const inquirer = require('inquirer');// inquirer module for prompting user 
const db = require('./public/connection');

// CONNECTING TO DATABASE HERE
db.connect((error) => {
      if (error) {
        console.error('Error connecting to the database:', error);
        return;
      }
    
      console.log('Connected to the Employee database.');
    
      promptQuestions(); // Call the function to start prompting the user
});

// PROMPT QUESTIONS FUNCTION THAT PROMPTS ALL QUESTIONS    
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
              addRole();
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

// VIEW DEPARTMENTS FUNCTION HERE  
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
// Add Department Function is Here
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
// Veiw Roles Function Here
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
  console.log('Retrieving employee details...');
  db.query(`
  SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id
`, (err, results) => {
    if (err) {
      console.error('Error viewing employees:', err);
      promptQuestions();
      return;
    }
    console.table(results);
    promptQuestions();
  });
}
//////////////////////////////////////
//add employee function
function addEmployee() {

  db.query('SELECT * FROM role', (err, roleResults) => {
    if (err) {
      console.error('Error fetching roles:', roleErr);
      return;
    }

    const roleChoices = roleResults.map((row) => ({name : row.title, value: row.id}));

    db.query('SELECT * FROM employee', (managerErr, managerResults) => {
      if (managerErr) {
        console.error('Error fetching managers:', managerErr);
        return;
      }

      const managerChoices = managerResults
    .filter((row) => row.manager_id !== null) // Filter out rows with null manager_id
    .map((row) => ({
    name: `${row.first_name} ${row.last_name}`,
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

//update employee function here
function updateEmployeeRole(){
  db.query('SELECT * FROM employee', (err, employeeChoice) => {
    if(err){
      console.log(err,'Error Getting Employee names');
      return;
    }
    const employeeName = employeeChoice.map((row) => ({name:row.first_name, value:row.isd}));
    db.query('SELECT * FROM role', (err, roleResults) => {
    if (err) {
      console.error('Error fetching roles:', roleErr);
      return;
    }
    const roleChoices = roleResults.map((row) => ({name:row.title, value:row.id }));
  
    inquirer
  .prompt([{
    type: 'list',
    choices: employeeName,
    name: 'EMPLOYEE_ID',
    message: 'Select the employee you want to update:',
  },
  {
    type: 'list',
    choices: roleChoices,
    name: 'ROLE_ID',
    message: 'Select the new role ID for the employee:',
  },])
  .then((answers) => {
    db.query('UPDATE employee SET role_id = ? WHERE employee.id = ?', [answers.ROLE_ID, answers.EMPLOYEE_ID], (err) => {
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
  });
  });
  
}


const addRole = () => {
  db.query('SELECT * FROM department', (err, departmentResults) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return;
    }
    const departmentChoices = departmentResults.map((row) => ({name:row.name, value:row.id}));
    inquirer
    .prompt([{
    name: 'ROLE_NAME',
    message: 'Enter Name Of New Role',
    type: 'input'
    },
    {name: 'ROLE_SALARY',
    message: 'What is the salary of the role',
    type: 'input'},
    {name: 'WHAT_DEPARTMENT_ROLE',
    message: 'Which department does the role belong to?',
    type: 'list', choices: departmentChoices
    }]
    )
    .then((answers) => {
      db.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',[answers.ROLE_NAME, answers.ROLE_SALARY, answers.WHAT_DEPARTMENT_ROLE],(err) => {
        if (err) {
          console.error('Error Adding Role:', err);
          promptQuestions();
          return;
        }
        console.log('Role Added successfully!');
        promptQuestions();
      });
      })
      .catch((error) => {
      console.error('Error:', error);
      });
  });
}