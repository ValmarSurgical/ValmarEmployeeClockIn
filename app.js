// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuQwsqL_sOYHHlzsqUyg-dnTPtNh8Kp1s",
    authDomain: "employeemanagement-28132.firebaseapp.com",
    projectId: "employeemanagement-28132",
    storageBucket: "employeemanagement-28132.firebasestorage.app",
    messagingSenderId: "20059564448",
    appId: "1:20059564448:web:c0711f370a68d4eaa89cc5",
    measurementId: "G-D2S9RGW84N"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);
const db = firebase.getFirestore(app);

// Function to handle login
function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    firebase.signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = 'add-hours.html';  // Redirect to Add Hours page
        })
        .catch((error) => {
            alert('Login failed: ' + error.message);
        });
}

// Load employees and attendance for Add Hours page
async function loadEmployeeAttendance() {
    const employeeTable = document.getElementById("attendance-table").getElementsByTagName("tbody")[0];
    const employeesSnapshot = await firebase.getDocs(firebase.collection(db, "employees"));
    
    employeesSnapshot.forEach((doc) => {
        const employee = doc.data();
        const row = employeeTable.insertRow();
        
        row.innerHTML = `
            <td>${employee.name}</td>
            <td><input type="checkbox" name="absent" value="Yes"></td>
            <td><input type="time" name="clock-in"></td>
            <td><input type="time" name="clock-out"></td>
            <td><input type="number" name="total-hours" value="0" readonly></td>
        `;
    });
}

// Load employees for Add/Edit Employees page
async function loadEmployees() {
    const employeeTable = document.getElementById("employee-table").getElementsByTagName("tbody")[0];
    const employeesSnapshot = await firebase.getDocs(firebase.collection(db, "employees"));
    
    employeesSnapshot.forEach((doc) => {
        const employee = doc.data();
        const row = employeeTable.insertRow();
        
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>${employee.company}</td>
            <td>${employee.active ? 'Yes' : 'No'}</td>
            <td>${employee.hireDate || 'N/A'}</td>
        `;
    });
}

// Generate payroll for Run Payroll page
function generatePayroll() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    
    // Example payroll data (replace with real logic)
    const payrollResults = `
        <h3>Payroll from ${fromDate} to ${toDate}</h3>
        <table>
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Total Hours</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>John Doe</td>
                    <td>40</td>
                </tr>
                <tr>
                    <td>Jane Smith</td>
                    <td>
