// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Authentication functions
async function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
        displayClockArea();
    } catch (error) {
        console.error("Error signing in:", error);
    }
}

function signOut() {
    auth.signOut().then(() => {
        document.getElementById("login-form").style.display = "block";
        document.getElementById("clock-area").style.display = "none";
        document.getElementById("admin-area").style.display = "none";
    });
}

// Show clock area for employees
function displayClockArea() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("clock-area").style.display = "block";
}

// Clock-In/Out functions
async function clockIn() {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const userId = auth.currentUser.uid;
    await db.collection("clockRecords").add({
        employeeId: userId,
        clockIn: timestamp,
        clockOut: null
    });
    alert("Clock-in recorded!");
}

async function clockOut() {
    const userId = auth.currentUser.uid;
    const clockOutTime = firebase.firestore.FieldValue.serverTimestamp();
    const clockRecord = await db.collection("clockRecords")
        .where("employeeId", "==", userId)
        .where("clockOut", "==", null)
        .limit(1)
        .get();

    if (!clockRecord.empty) {
        const recordId = clockRecord.docs[0].id;
        await db.collection("clockRecords").doc(recordId).update({
            clockOut: clockOutTime
        });
        alert("Clock-out recorded!");
    } else {
        alert("No clock-in record found.");
    }
}

// Admin functions
async function addEmployee() {
    const name = document.getElementById("employee-name-input").value;
    const email = document.getElementById("employee-email-input").value;
    const hourlyRate = parseFloat(document.getElementById("employee-rate-input").value);
    await db.collection("employees").add({
        name: name,
        email: email,
        hourlyRate: hourlyRate
    });
    alert("Employee added!");
}

async function calculatePayroll() {
    const employeeId = document.getElementById("payroll-employee-id").value;
    const records = await db.collection("clockRecords")
        .where("employeeId", "==", employeeId)
        .where("clockOut", "!=", null)
        .get();

    let totalHours = 0;

    records.forEach((record) => {
        const clockIn = record.data().clockIn.toDate();
        const clockOut = record.data().clockOut.toDate();
        const hoursWorked = (clockOut - clockIn) / (1000 * 60 * 60);
        totalHours += hoursWorked;
    });

    const employee = await db.collection("employees").doc(employeeId).get();
    const hourlyRate = employee.data().hourlyRate;
    const weeklyPay = totalHours * hourlyRate;

    alert(`Weekly payroll for ${employee.data().name}: $${weeklyPay.toFixed(2)}`);
}
