const inquirer = require('inquirer');// inquirer module for prompting user 
const db = require('./helper/connection');

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
  SELECT employee.sid, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.sid
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

  db.query('SELECT title FROM role', (err, roleResults) => {
    if (err) {
      console.error('Error fetching roles:', roleErr);
      return;
    }

    const roleChoices = roleResults.map((row) => row.title);

    db.query('SELECT first_name FROM employee WHERE manager_id IS NOT NULL', (managerErr, managerResults) => {
      if (managerErr) {
        console.error('Error fetching managers:', managerErr);
        return;
      }

      const managerChoices = managerResults.map((row) => ({
        name: row.first_name,
        value: row.first_name,
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
          switch(answers.EMPLOYEE_ROLE){
            case 'Sales Person':
              roletype = 1;
              break;
            case 'Lead Engineer':
              roletype = 2;
              break;
            case 'Software Engineer':
              roletype = 3;
              break;
              case 'Legal Team Lead':
              roletype = 4;
              break;
              case 'Lawyer':
              roletype = 5;
              break;
              case 'Accountant':
              roletype = 6;
              break;
              case 'Account Manager':
              roletype = 7;
              break;
              case 'Sales Lead':
              roletype = 8;
              break;
              default:
                roletype = 1;
                break;

          }
          switch(answers.EMPLOYEE_MANAGER){
            case 'John':
              manager = 1;
              break;
            case 'Jane':
              manager = 2;
              break;
            case 'Chris':
              manager = 4;
              break;
              case 'Arnold':
              manager = 5;
              break;
              case 'Ronnie':
              manager = 6;
              break;
              case 'Jay':
              manager = 7;
              break;
              case 'Lou':
              manager = 7;
              break;
              default:
                manager = 1;
                break;
          }
          db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [answers.FIRST_NAME, answers.LAST_NAME, roletype, manager], (err) => {
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
  db.query('SELECT first_name FROM employee', (err, employeeChoice) => {
    if(err){
      console.log(err,'Error Getting Employee names');
      return;
    }
    const employeeName = employeeChoice.map((row) => row.first_name);
    db.query('SELECT title FROM role', (err, roleResults) => {
    if (err) {
      console.error('Error fetching roles:', roleErr);
      return;
    }
    const roleChoices = roleResults.map((row) => row.title);
  
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
    switch(answers.EMPLOYEE_ID){
      case 'John':
        employee = 1;
        break;
        case 'Jane':
          employee = 2;
          break;
          case 'Alex':
            employee = 3;
            break;
            case 'Chris':
              employee = 4;
              break;
              case 'Arnold':
                employee = 5;
                break;
                case 'Ronnie':
                  employee = 6;
                  break;
                  case 'Jay':
                    employee = 7;
                    case 'Lou':
                      employee = 8;
                      break;
                      default:
                        employee = 1;
      }
      switch(answers.ROLE_ID){
        case 'Sales Person':
        role = 1;
        break;
        case 'Lead Engineer':
          role = 2;
          break;
          case 'Software Engineer':
            role = 3;
            break;
            case 'Legal Team Lead':
              role = 4;
              break;
              case 'Lawyer':
                role = 5;
                break;
                case 'Accountant':
                  role = 6;
                  break;
                  case 'Account Manager':
                    role = 7;
                    case 'Sales Lead':
                      role = 8;
                      break;
                      default:
                        role = 1;
    }
    db.query('UPDATE employee SET role_id = ? WHERE employee.sid = ?', [employee, role], (err) => {
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
//todo : implement add role function
const addRole = () => {
  db.query('SELECT name FROM department', (err, departmentResults) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return;
    }
    const departmentChoices = departmentResults.map((row) => row.name);
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
      switch(answers.WHAT_DEPARTMENT_ROLE){
        case 'Sales':
          departmentType = 1;
          break;
        case ' Engineering':
          departmentType = 2;
          break;
        case 'Finance':
          departmentType = 3;
          break;
        case 'Legal Team':
          departmentType = 4;
          break;
        default:
          departmentType = 1;    
          break;      
      }
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