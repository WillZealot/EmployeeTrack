const mysql = require('mysql2');
const inquirer = require('inquirer');// inquirer module for prompting user 
const viewEmployees = require('./public/mitochondria');//importing main function wow


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

db.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }

  console.log('Connected to the Employee database.');

  promptQuestions(); // Call the function to start prompting the user
});

const questions = [
    { name: 'DO_WHAT', message: 'What would you like to do?', type: 'list', choices: [
        'View Departments', //when view employees do db.query select * from department
        'View Roles',       //when view roles do db.query select * from roles
        'View Employees',   //when view employees do db.query select * from employees
        'Add Department',   // when add department DEPARTMENT_NAME question prompts
        'Add Role',         // when add role ROLE_NAME question prompts
        'Add Employee',     // when add employee FIRST_NAME, LAST_NAME, EMPLOYEE_ROLE questions prompt
        'Update Employee Role',
        'Quit',
      ]},
    {name: 'DEPARTMENT_NAME',
    message: 'Enter Name Of New Department',
    type: 'input',
    when: (answers) => answers.DO_WHAT === 'Add Department'},
    ///////////////////////////////////////////////////////////////


    {name: 'ROLE_NAME',
    message: 'Enter Name Of New Role',
    type: 'input',
    when: (answers) => answers.DO_WHAT === 'Add Role'},
    {name: 'ROLE_SALARY',
    message: 'What is the salary of the role',
    type: 'input',
    when: (answers) => answers.DO_WHAT === 'Add Role'},
    {name: 'WHAT_DEPARTMENT_ROLE',
    message: 'Which department does the role belong to?',
    type: 'list', choices: [`SELECT * FROM department`], // THIS NEEDS TO HAVE THE LIST OF DEPARTMENTS FROM THE DEPARTMENT TABLE !!!
    when: (answers) => answers.DO_WHAT === 'Add Role'},
    /////////////////////////////////////////////////////////////


    {name: 'FIRST_NAME',
    message: "What is the employee's first name",
    type: 'input',
    when: (answers) => answers.DO_WHAT === 'Add Employee'},
    {name: 'LAST_NAME',
    message: "What is the employee's last name",
    type: 'input',
    when: (answers) => answers.DO_WHAT === 'Add Employee'},
    {name: 'EMPLOYEE_ROLE',
    message: "What is the employee's role",
    type: 'list', choices: [],// THIS NEEDS TO HAVE THE LIST FROM THE ROLES TABLE IN DATABASE !!!
    when: (answers) => answers.DO_WHAT === 'Add Employee'}, 
    {name: 'EMPLOYEE_MANAGER',
    message: "Who is the employee's manager",
    type: 'list', choices: [], // THIS NEEDS TO HAVE THE LIST FROM THE EMPLOYEES TABLE IN DATABASE !!!
    when: (answers) => answers.DO_WHAT === 'Add Employee'},
    ///////////////////////////////////////////////////////////


    {name: 'UPDATE_EMPLOYEE_ROLE',
    message: "Which employee's role do you want to update ?",
    type: 'list', choices: [],
    when: (answers) => answers.DO_WHAT === 'Update Employee Role'}, // THIS NEEDS TO HAVE THE LIST FROM THE EMPLOYEES TABLE IN DATABASE !!!
    {name: 'SELECT_UPDATE_EMPLOYEE_ROLE',
    message: "Which role do you want to assign the selected employee ?",
    type: 'list', choices: [], // THIS NEEDS TO HAVE THE LIST FROM THE ROLE TABLE IN DATABASE !!!
    when: (answers) => answers.DO_WHAT === 'Update Employee Role'},
  ];




  function promptQuestions() {
    inquirer
      .prompt(questions)
      .then((answers) => {
        
        // Additional logic based on prompt answers
        if (answers.DO_WHAT === 'Add Department') {
          console.log(`Added ${answers.DEPARTMENT_NAME} to the database`);
        }

        if (answers.DO_WHAT === 'View Employees') {
          db.query({ sql:'SELECT * FROM `employee` RIGHT JOIN role ON role.id = employee.role_id', rowsAsTables: true }, function(err, results) {
            console.table(results); // in this query, results will be an array of arrays rather than an array of objects
          });
          }

        if (answers.DO_WHAT === 'Quit') {
            console.log('Exiting the program...');
            process.exit();
          }
  
        // Recursive call to promptQuestions to continue the prompt process
        promptQuestions();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }