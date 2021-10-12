INSERT INTO department (id, name)
VALUES  (1, "Accounting"),
        (2, "Research and Development"),
        (3, "Human Resource Managment"),
        (4, "Marketing");

INSERT INTO role (id, title, salary, department_id)
VALUES  (1, "Accountant", 50000, 1),
        (2, "Marketing Manager", 80000, 4),
        (3, "Human Resources Manager", 75000, 3),
        (4, "Process Engineer", 105000, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1, "John", "Doe", 1, NULL),
        (2, "Bob", "Smith", 3, NULL),
        (3, "Mary", "Johnson", 4, NULL),
        (4, "Amy", "Martin", 2, NULL);