INSERT INTO department (name)
VALUES  ("Accounting"),
        ("Research and Development"),
        ("Human Resource Managment"),
        ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES  ("Accountant", 50000, 1),
        ("Marketing Manager", 80000, 4),
        ("Human Resources Manager", 75000, 3),
        ("Process Engineer", 105000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 1, NULL),
        ("Bob", "Smith", 3, NULL),
        ("Mary", "Johnson", 4, NULL),
        ("Amy", "Martin", 2, NULL);