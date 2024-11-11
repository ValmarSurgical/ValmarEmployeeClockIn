// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCuQwsqL_sOYHHlzsqUyg-dnTPtNh8Kp1s",
    authDomain: "employeemanagement-28132.firebaseapp.com",
    projectId: "employeemanagement-28132",
    storageBucket: "employeemanagement-28132.firebasestorage.app",
    messagingSenderId: "20059564448",
    appId: "1:20059564448:web:c0711f370a68d4eaa89cc5",
    measurementId: "G-D2S9RGW84N"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);
const db = firebase.getFirestore(app);

// Load Employee Attendance
async function loadEmployeeAttendance() {
    const employeeTable = document.getElementById("attendance-table").getElementsByTagName("tbody")[0];
    const employeesSnapshot = await firebase.getDocs(firebase.collection(db, "employees"));

    employeesSnapshot.forEach((doc) => {
        const employee = doc.data();
        const row = employeeTable.insertRow();

        // Create editable row with submit button
        row.innerHTML = `
            <td>${employee.name}</td>
            <td><input type="checkbox" name="absent" value="Yes" onchange="toggleClockInOut(this)"></td>
            <td><input type="time" name="clock-in" onchange="calculateHours(this)"></td>
            <td><input type="time" name="clock-out" onchange="calculateHours(this)"></td>
            <td><input type="number" name="total-hours" value="0" onchange="calculateHours(this)" readonly></td>
            <td><button type="button" onclick="updateRow(this)">Submit</button></td>
        `;
    });
}

// Function to calculate total hours (Clock Out - Clock In - 30 minutes)
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

// Function to disable Clock In/Out when Absent is checked
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

// Function to update a single row
function updateRow(button) {
    const row = button.closest("tr");
    const name = row.querySelector('td').textContent;
    const absent = row.querySelector('[name="absent"]').checked;
    const clockIn = row.querySelector('[name="clock-in"]').value;
    const clockOut = row.querySelector('[name="clock-out"]').value;
    const totalHours = row.querySelector('[name="total-hours"]').value;

    // Perform the update (this is where you would write the code to save the data to Firebase)
    console.log(`Updating row for ${name}: Absent=${absent}, Clock In=${clockIn}, Clock Out=${clockOut}, Total Hours=${totalHours}`);
    // Example: save to Firebase (not implemented here)
}

// Function to update all rows at once
function updateAllRows() {
    const rows = document.querySelectorAll("#attendance-table tbody tr");
    rows.forEach(row => {
        const name = row.querySelector('td').textContent;
        const absent = row.querySelector('[name="absent"]').checked;
        const clockIn = row.querySelector('[name="clock-in"]').value;
        const clockOut = row.querySelector('[name="clock-out"]').value;
        const totalHours = row.querySelector('[name="total-hours"]').value;

        // Perform the update for each row
        console.log(`Updating row for ${name}: Absent=${absent}, Clock In=${clockIn}, Clock Out=${clockOut}, Total Hours=${totalHours}`);
        // Example: save to Firebase (not implemented here)
    });
}

// Initialize the page
window.onload = function() {
    document.getElementById("date").value = new Date().toISOString().split("T")[0]; // Prepopulate the date field
    loadEmployeeAttendance(); // Load the employees into the table
};
