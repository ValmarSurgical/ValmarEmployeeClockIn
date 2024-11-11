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
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

      // Check if user is admin
      if (user.email === "slazar@valmarsurgical.com") { // Replace with your admin email
        showAdminDashboard(); // Function to show admin's UI
      } else {
        alert("Access denied! You are not an admin.");
      }
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

// Admin features (Add/Edit employee, Payroll, etc.) will be added below
