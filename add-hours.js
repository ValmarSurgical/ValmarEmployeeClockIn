// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuQwsqL_sOYHHlzsqUyg-dnTPtNh8Kp1s",
    authDomain: "employeemanagement-28132.firebaseapp.com",
    projectId: "employeemanagement-28132",
    storageBucket: "employeemanagement-28132.appspot.com",
    messagingSenderId: "20059564448",
    appId: "1:20059564448:web:c0711f370a68d4eaa89cc5",
    measurementId: "G-D2S9RGW84N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load employees for attendance
async function loadEmployeeAttendance() {
    const employeeTable = document.getElementById("attendance-table").getElementsByTagName("tbody")[0];
    const employeesSnapshot = await getDocs(collection(db, "employees"));
    
    employeesSnapshot.forEach((doc) => {
        const employee = doc.data();
        if (!employee.active) return;

        const row = employeeTable.insertRow();
        const attendanceData = employee.attendance || {};

        row.innerHTML = `
            <td>${employee.name}</td>
            <td><input type="checkbox" name="absent" value="Yes" ${attendanceData.absent ? 'checked' : ''} onchange="toggleClockInOut(this)"></td>
            <td><input type="time" name="clock-in" value="${attendanceData.clockIn || ''}" onchange="calculateHours(this)"></td>
            <td><input type="time" name="clock-out" value="${attendanceData.clockOut || ''}" onchange="calculateHours(this)"></td>
            <td><input type="number" name="total-hours" value="${attendanceData.totalHours || 0}" readonly></td>
            <td><button type="button" onclick="updateRow(this)">Update</button></td>
        `;
    });
}

// Function to calculate total hours based on clock-in and clock-out times
function calculateHours(input) {
    const row = input.closest("tr");
    const clockIn = row.querySelector('[name="clock-in"]').value;
    const clockOut = row.querySelector('[name="clock-out"]').value;
    const absentCheckbox = row.querySelector('[name="absent"]');
    const totalHoursInput = row.querySelector('[name="total-hours"]');

    if (clockIn && clockOut && !absentCheckbox.checked) {
        const clockInTime = new Date(`1970-01-01T${clockIn}:00`);
        const clockOutTime = new Date(`1970-01-01T${clockOut}:00`);
        const totalMinutes = (clockOutTime - clockInTime) / 60000 - 30; // Subtract 30 minutes for lunch
        totalHoursInput.value = (totalMinutes / 60).toFixed(2);
    } else {
        totalHoursInput.value = 0;
    }
}

// Disable clock-in and clock-out fields if absent is checked
function toggleClockInOut(checkbox) {
    const row = checkbox.closest("tr");
    const clockIn = row.querySelector('[name="clock-in"]');
    const clockOut = row.querySelector('[name="clock-out"]');
    
    if (checkbox.checked) {
        clockIn.disabled = true;
        clockOut.disabled = true;
    } else {
        clockIn.disabled = false;
        clockOut.disabled = false;
    }
}

// Update a specific row in the Firestore database
async function updateRow(button) {
    const row = button.closest("tr");
    const name = row.querySelector('td').textContent;
    const absent = row.querySelector('[name="absent"]').checked;
    const clockIn = row.querySelector('[name="clock-in"]').value;
    const clockOut = row.querySelector('[name="clock-out"]').value;
    const totalHours = row.querySelector('[name="total-hours"]').value;

    const employeeRef = doc(db, "employees", name); // Assuming employee names are unique
    await updateDoc(employeeRef, {
        attendance: {
            absent,
            clockIn,
            clockOut,
            totalHours
        }
    });

    console.log(`Updated row for ${name}: Absent=${absent}, Clock In=${clockIn}, Clock Out=${clockOut}, Total Hours=${totalHours}`);
}

// Update all rows at once
async function updateAllRows() {
    const rows = document.querySelectorAll("#attendance-table tbody tr");
    for (let row of rows) {
        const name = row.querySelector('td').textContent;
        const absent = row.querySelector('[name="absent"]').checked;
        const clockIn = row.querySelector('[name="clock-in"]').value;
        const clockOut = row.querySelector('[name="clock-out"]').value;
        const totalHours = row.querySelector('[name="total-hours"]').value;

        const employeeRef = doc(db, "employees", name);
        await updateDoc(employeeRef, {
            attendance: {
                absent,
                clockIn,
                clockOut,
                totalHours
            }
        });

        console.log(`Updated row for ${name}: Absent=${absent}, Clock In=${clockIn}, Clock Out=${clockOut}, Total Hours=${totalHours}`);
    }
}

// Prepopulate the date field with today's date
window.onload = function() {
    document.getElementById("date").value = new Date().toISOString().split("T")[0];
    loadEmployeeAttendance(); // Load the employee attendance into the table
};
