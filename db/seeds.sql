INSERT INTO department (id, name) -- department table insert
VALUES
    ( 1, "Sales"),
    ( 2, "Engineering"),
    ( 3, "Finance"),
    ( 4, "Legal Team");


INSERT INTO role (id,title,salary,department_id) -- role table insert
VALUES
    ( 1, "Sales Person",80000,1),
    ( 2, "Lead Engineer",150000,2),
    ( 3, "Software Engineer",120000,2),
    ( 4, "Legal Team Lead",250000,4),
    ( 5, "Lawyer",190000,4),
    ( 6, "Accountant",125000,3),
    ( 7, "Account Manager",160000,3),
    ( 8, "Sales Lead",100000,1);

INSERT INTO employee (id,first_name,last_name,role_id,manager_id) -- employee insert
VALUES
    ( 1, "John","Smith",8,NULL),
    ( 2, "Jane","Doe",1,8), 
    ( 3, "Alex","Eubank",2,NULL),
    ( 4, "Chris","Bumstead",3,2),
    ( 5, "Arnold","Schwarzenegger",4,NULL),
    ( 6, "Ronnie","Coleman",5,5),
    ( 7, "Jay","Cutler",6,7),
    ( 8, "Lou","Ferrigno",7,NULL);