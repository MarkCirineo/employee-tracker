const express = require("express");
const inquirer = require("inquirer");
const db = require("./connection");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const viewAll = (table) => {
    const viewAllQuery = "SELECT * FROM ";
    db.query(viewAllQuery + table, (err, results) => {
        if (err) {
            console.error(err);
        }
        console.table(results)
    });
}

const initQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "firstAction",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee"]
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

                        break;
                    case "Add a role":

                        break;
                    case "Add an employee":

                        break;
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