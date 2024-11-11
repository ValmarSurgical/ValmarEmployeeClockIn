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

// Import Firebase SDK v9+ using ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin Login
document.getElementById('signInButton').addEventListener('click', signIn);

function signIn() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in as:", user.email);
      showAdminDashboard(); // Automatically show admin dashboard after login
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error signing in:", errorCode, errorMessage);
      alert("Login failed: " + errorMessage); // Show error message
    });
}

// Show Admin Dashboard after login
function showAdminDashboard() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
  loadDashboard();
}

// Load Dashboard Content
function loadDashboard() {
  const dashboardContent = document.getElementById("dashboard-content");
  
  // Create a date field prepopulated with today's date
  const dateField = document.createElement("input");
  dateField.type = "date";
  dateField.value = new Date().toISOString().split("T")[0]; // Prepopulate with today’s date
  dashboardContent.appendChild(dateField);

  // Create a table for employee attendance and clock-in/clock-out
  const table = document.createElement("table");
  table.id = "attendance-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Absent</th>
        <th>Clock In</th>
        <th>Clock Out</th>
        <th>Total Hours</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  dashboardContent.appendChild(table);
  loadEmployeeAttendance();
}

// Load Employee Attendance
async function loadEmployeeAttendance() {
  const employeeTable = document.getElementById("attendance-table").getElementsByTagName("tbody")[0];
  const employeesSnapshot = await getDocs(collection(db, "employees"));
  
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

// Navigate to Add/Edit Employees Screen
document.getElementById('goToAddEditEmployees').addEventListener('click', function() {
  document.getElementById("admin-dashboard").style.display = "none";
  document.getElementById("employee-management").style.display = "block";
  loadEmployeeManagement();
});

// Navigate to Payroll Screen
document.getElementById('goToPayroll').addEventListener('click', function() {
  document.getElementById("admin-dashboard").style.display = "none";
  document.getElementById("payroll").style.display = "block";
});

// Go Back to Dashboard from Employee Management
document.getElementById('backToDashboardFromEmployee').addEventListener('click', function() {
  document.getElementById("employee-management").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
});

// Go Back to Dashboard from Payroll
document.getElementById('backToDashboardFromPayroll').addEventListener('click', function() {
  document.getElementById("payroll").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
});

// Load Employee Management (Add/Edit Employees)
function loadEmployeeManagement() {
  const employeeTable = document.getElementById("employee-table").getElementsByTagName("tbody")[0];
  // Here you can add functionality to display, edit, or add employees.
  // (This would require getting data from Firestore and updating/additional inputs to create/edit employees.)
}

// Payroll functionality (To be added in future, handle form submission for payroll generation)
document.getElementById('payroll-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  console.log("Generating payroll for", fromDate, "to", toDate);
  // Add the payroll generation logic here (e.g., calculate total hours for the given date range)
});
