const express = require("express");
const inquirer = require("inquirer");
const db = require("./connection");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const departmentQuestions = [
    {
        type: "input",
        message: "Enter the name of the department you want to add.",
        name: "name"
    }
]

const addDepartment = () => {
    inquirer
        .prompt(departmentQuestions)
            .then(data => {
                db.query(`INSERT INTO department (name) VALUES (?)`, data.name, (err, results) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log(`Successfully added ${data.name} to the database.`);
                    init();
                })
            });
}

const roleQuestions = [
    {
        type: "input",
        message: "Enter the name of the role you want to add.",
        name: "name"
    },
    {
        type: "input",
        message: "Enter the salary of the role.",
        name: "salary"
    },
    {
        type: "list",
        message: "Which department does the role belong to?",
        name: "department",
        choices: []
    }
]

const addRole = () => {
    roleQuestions[2].choices = []
    
    db.query("SELECT id, name FROM department", (err, results) => {
        if (err) {
            console.error(err)
        }
        results.forEach((department) => {
            roleQuestions[2].choices.push(department.name)
        });
        inquirer
            .prompt(roleQuestions)
                .then(data => {
                    let department_id = "";
                    results.forEach(department => {
                        if (department.name === data.department) {
                            department_id = department.id;
                        }
                    })
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [data.name, data.salary, department_id], (err, results) => {
                        if (err) {
                            console.error(err);
                        }
                        console.log(`Successfully added ${data.name} to the database.`);
                        init();
                    })
                });
    });
}

const employeeQuestions = [
    {
        type: "input",
        message: "Enter the first name of the employee you want to add.",
        name: "firstName"
    },
    {
        type: "input",
        message: "Enter the last name of the employee you want to add.",
        name: "lastName"
    },
    {
        type: "list",
        message: "Which role does the employee have?",
        name: "role",
        choices: []
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        name: "manager",
        choices: []
    }
]

const addEmployee = () => {
    employeeQuestions[2].choices = [];
    employeeQuestions[3].choices = ["None"];
    
    db.query("SELECT id, title FROM role", (err, results) => {
        if (err) {
            console.error(err)
        }
        results.forEach((role) => {
            employeeQuestions[2].choices.push(role.title);
        });
        db.query("SELECT id, first_name, last_name FROM employee", (err, employeeResults) => {
            if (err) {
                console.error(err)
            }
            employeeResults.forEach(role => {
                employeeQuestions[3].choices.push(role.first_name + " " + role.last_name)
            })
            inquirer
                .prompt(employeeQuestions)
                    .then(data => {
                        let roleId = "";
                        let managerId = "";
                        results.forEach(role => {
                            if (role.title === data.role) {
                                roleId = role.id;
                            }
                        })
                        employeeResults.forEach(manager => {
                            if (manager.first_name + " " + manager.last_name === data.manager) {
                                managerId = manager.id;
                            } else {
                                managerId = null;
                            }
                        })
                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [data.firstName, data.lastName, roleId, managerId], (err, results) => {
                            if (err) {
                                console.error(err);
                            }
                            console.log(`Successfully added ${data.firstName} to the database.`);
                            init();
                        })
                    });
        })
    });
}

const updateEmployeeQuestions = [
    {
        type: "list",
        message: "Enter the name of the employee you would like to update.",
        name: "chosenEmployee",
        choices: []
    },
    {
        type: "list",
        message: "What is this employee's new role?",
        name: "newRole",
        choices: []
    }
]

const updateEmployee = () => {
    updateEmployeeQuestions[0].choices = [];
    updateEmployeeQuestions[1].choices = [];

    db.query("SELECT id, first_name, last_name FROM employee", (err, results) => {
        if (err) {
            console.error(err)
        }
        results.forEach(employee => {
            updateEmployeeQuestions[0].choices.push(employee.first_name + " " + employee.last_name);
        });
        db.query("SELECT id, title FROM role", (err, roleResults) => {
            if (err) {
                console.error(err)
            }
            roleResults.forEach(role => {
                updateEmployeeQuestions[1].choices.push(role.title)
                console.log(role.title)
            })
            inquirer
                .prompt(updateEmployeeQuestions)
                    .then(data => {
                        let nameArr = data.chosenEmployee.split(" ");
                        let firstName = nameArr[0]
                        let lastName = nameArr[1]
                        let roleId = "";
                        roleResults.forEach(role => {
                            if (role.title === data.newRole) {
                                roleId = role.id;
                            }
                        })
                        db.query(`UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`, [roleId, firstName, lastName], (err, results) => {
                            if (err) {
                                console.error(err);
                            }
                            console.log(`Successfully update ${firstName}'s role.`);
                            init();
                        })
                    });
        });        
    });
    
}

const viewAll = (table) => {
    let viewAllQuery = "";
    if (table === "department") {
        viewAllQuery = "SELECT * FROM department";
    } else if (table === "role") {
        viewAllQuery = "SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id ";
    } else if (table === "employee") {
        viewAllQuery = "SELECT a.id, CONCAT(a.first_name, ' ', a.last_name) AS name, CONCAT(b.first_name, ' ', b.last_name) AS manager, role.title, role.salary, department.name AS department FROM employee a LEFT JOIN employee b ON a.manager_id = b.id JOIN role ON a.role_id = role.id JOIN department ON role.department_id = department.id";
    }
    db.query(viewAllQuery, (err, results) => {
        if (err) {
            console.error(err);
        }
        const viewAllTable = cTable.getTable(results);
        // console.table(results)
        console.log(viewAllTable);
        init();
    });
    
}

const initQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "firstAction",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee", "Quit"]
    }
]

const init = () => {
    inquirer
        .prompt(initQuestion)
            .then((data) => {
                switch(data.firstAction) {
                    case "View all departments":
                        viewAll("department");
                        break;
                    case "View all roles":
                        viewAll("role");
                        break;
                    case "View all employees":
                        viewAll("employee");
                        break;
                    case "Add a department":
                        addDepartment();
                        break;
                    case "Add a role":
                        addRole();
                        break;
                    case "Add an employee":
                        addEmployee();
                        break;
                    case "Update an employee":
                        updateEmployee();
                        break;
                    case "Quit":
                        return;
                }
            })
}

init();

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Successfully listening on https://localhost:${PORT}`);
});