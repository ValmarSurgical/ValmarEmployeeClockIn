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
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Prepopulate the date input with today's date
document.getElementById('dateInput').value = new Date().toISOString().split("T")[0];

// Function to load employees and their attendance for Add Hours page
async function loadEmployeeAttendance() {
    const employeeTable = document.getElementById("attendance-table").getElementsByTagName("tbody")[0];
    const employeesSnapshot = await getDocs(collection(db, "employees"));
    
    // Check if employees are available in Firestore
    if (!employeesSnapshot.empty) {
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
    } else {
        console.log("No employees found in Firestore.");
    }
}

// Load employees when the page is loaded
window.onload = () => {
    loadEmployeeAttendance();
};

// Logout function to return to the login page
function logout() {
    firebase.signOut(auth).then(() => {
        window.location.href = 'index.html'; // Redirect to login page
    });
}
