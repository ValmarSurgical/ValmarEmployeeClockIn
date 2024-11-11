import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", loadEmployees);

function loadEmployees() {
    const dateInput = document.getElementById("dateInput");
    const today = new Date().toISOString().split("T")[0];  // Get today's date in YYYY-MM-DD format
    dateInput.value = today;

    const employeesRef = collection(db, "employees");
    getDocs(employeesRef)
        .then((querySnapshot) => {
            const tableBody = document.getElementById("employeeTable").querySelector("tbody");
            querySnapshot.forEach((doc) => {
                const employeeData = doc.data();
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${employeeData.name}</td>
                    <td><select><option>No</option><option>Yes</option></select></td>
                    <td></td>
                    <td></td>
                    <td>0</td>
                `;
            });
        })
        .catch((error) => {
            console.error("Error loading employees: ", error);
        });
}

function updateEmployees() {
    // Logic to update single employee's clock-in/out
}

function updateMultipleEmployees() {
    // Logic to update multiple employees at once
}
