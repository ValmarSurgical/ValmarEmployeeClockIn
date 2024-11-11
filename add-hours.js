// Import Firestore and Firebase methods
import { getFirestore, collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';

// Initialize Firestore
const db = getFirestore();

// Load Employee Attendance
async function loadEmployeeAttendance() {
    const employeeTable = document.getElementById("attendance-table").getElementsByTagName("tbody")[0];
    const employeesSnapshot = await getDocs(collection(db, "employees"));
    
    employeesSnapshot.forEach((doc) => {
        const employee = doc.data();
        if (!employee.active) return;  // Skip inactive employees

        const row = employeeTable.insertRow();

        // Check if the employee has clock-in and clock-out data
        const attendanceData = employee.attendance || {};  // Assuming "attendance" contains clock-in and clock-out data

        // Add the row for each employee
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

// Calculate Total Hours (Clock Out - Clock In - 30 minutes)
function calculateHours(input) {
    const row = input.closest("tr");
    const clockIn = row.querySelector('[name="clock-in"]').value;
    const clockOut = row.querySelector('[name="clock-out"]').value;
    const absentCheckbox = row.querySelector('[name="absent"]');
    const totalHoursInput = row.querySelector('[name="total-hours"]');

    // If either clock-in or clock-out is missing, we don't calculate hours
    if (clockIn && clockOut && !absentCheckbox.checked) {
        const clockInTime = new Date(`1970-01-01T${clockIn}:00`);
        const clockOutTime = new Date(`1970-01-01T${clockOut}:00`);
        const totalMinutes = (clockOutTime - clockInTime) / 60000 - 30; // Subtract 30 minutes for lunch
        totalHoursInput.value = (totalMinutes / 60).toFixed(2);
    } else {
        totalHoursInput.value = 0;
    }
}

// Disable Clock In/Out when Absent is checked
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

// Update a single row
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
}

// Initialize the page
window.onload = function() {
    document.getElementById("date").value = new Date().toISOString().split("T")[0]; // Prepopulate the date field
    loadEmployeeAttendance(); // Load the employees into the table
};
