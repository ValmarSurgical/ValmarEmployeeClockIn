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
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to load employees
async function loadEmployees() {
    const employeeTable = document.getElementById("employee-table").getElementsByTagName("tbody")[0];
    const employeesSnapshot = await getDocs(collection(db, "employees"));
    
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

// Function to show the Add Employee form
function showAddEmployeeForm() {
    document.getElementById("addEmployeeForm").style.display = "block";
}

// Function to hide the Add Employee form
function hideAddEmployeeForm() {
    document.getElementById("addEmployeeForm").style.display = "none";
}

// Function to add a new employee to Firestore
async function addEmployee() {
    const name = document.getElementById('employeeName').value;
    const position = document.getElementById('employeePosition').value;
    const company = document.getElementById('employeeCompany').value;
    const active = document.getElementById('employeeActive').value === 'true';
    const hireDate = document.getElementById('employeeHireDate').value;

    // Add employee to Firestore collection
    await addDoc(collection(db, "employees"), {
        name,
        position,
        company,
        active,
        hireDate: hireDate || null, // Optional field
    });

    // Reload the employee list after adding a new one
    loadEmployees();

    // Clear form inputs
    document.getElementById('employeeForm').reset();

    // Hide the form
    hideAddEmployeeForm();
}

// Load employees when the page is loaded
window.onload = () => {
    loadEmployees();
    
    // Adding event listener for the "Add Employee" button
    document.getElementById("showAddEmployeeBtn").addEventListener("click", showAddEmployeeForm);
};
