<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add/Edit Employees</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="navbar">
        <a href="index.html">Login</a>
        <a href="add-hours.html">Add Hours</a>
        <a href="add-edit-employees.html">Add/Edit Employees</a>
        <a href="run-payroll.html">Run Payroll</a>
        <button onclick="logout()">Logout</button>
    </div>

    <h2>Add/Edit Employees</h2>
    
    <!-- Button to show Add Employee form -->
    <button id="showAddEmployeeBtn">Add Employee</button>

    <!-- Add Employee Form (hidden by default) -->
    <div id="addEmployeeForm" style="display:none;">
        <h3>New Employee</h3>
        <form id="employeeForm">
            <label for="employeeName">Name:</label>
            <input type="text" id="employeeName" required /><br><br>

            <label for="employeePosition">Position:</label>
            <input type="text" id="employeePosition" required /><br><br>

            <label for="employeeCompany">Company:</label>
            <input type="text" id="employeeCompany" required /><br><br>

            <label for="employeeActive">Active:</label>
            <select id="employeeActive" required>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select><br><br>

            <label for="employeeHireDate">Hire Date:</label>
            <input type="date" id="employeeHireDate" /><br><br>

            <button type="button" id="addEmployeeBtn">Add Employee</button>
            <button type="button" onclick="hideAddEmployeeForm()">Cancel</button>
        </form>
    </div>

    <h3>Employee List</h3>
    <table id="employee-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Company</th>
                <th>Active</th>
                <th>Hire Date</th>
            </tr>
        </thead>
        <tbody>
            <!-- Employee rows will be added here dynamically -->
        </tbody>
    </table>

    <script type="module" src="add-employees.js"></script>
</body>
</html>
