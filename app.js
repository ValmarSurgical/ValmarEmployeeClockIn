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

// Sign In Function
document.getElementById('signInButton').addEventListener('click', signIn);

function signIn() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in as:", user.email);

      // Check if user is admin (example: check if email is admin)
      if (user.email === "slazar@valmarsurgical.com") { // Replace with your admin email or logic
        showAdminView(); // Function to show admin's UI
      } else {
        showEmployeeView(); // Function to show employee's UI
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error signing in:", errorCode, errorMessage);
      alert("Login failed: " + errorMessage); // Show error message
    });
}

// Show Admin view
function showAdminView() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("clock-area").style.display = "none";
  document.getElementById("admin-area").style.display = "block";
}

// Show Employee view
function showEmployeeView() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("clock-area").style.display = "block";
  document.getElementById("admin-area").style.display = "none";
}

// Add Employee function (Admin only)
async function addEmployee() {
  const name = document.getElementById("employee-name-input").value;
  const email = document.getElementById("employee-email-input").value;
  const hourlyRate = parseFloat(document.getElementById("employee-rate-input").value);
  await addDoc(collection(db, "employees"), {
    name: name,
    email: email,
    hourlyRate: hourlyRate
  });
  alert("Employee added!");
}

// Clock In/Out function
async function clockIn() {
  const timestamp = serverTimestamp();
  const userId = auth.currentUser.uid;
  await addDoc(collection(db, "clockRecords"), {
    employeeId: userId,
    clockIn: timestamp,
    clockOut: null
  });
  alert("Clock-in recorded!");
}

async function clockOut() {
  const userId = auth.currentUser.uid;
  const clockOutTime = serverTimestamp();
  const clockRecordQuery = query(
    collection(db, "clockRecords"),
    where("employeeId", "==", userId),
    where("clockOut", "==", null)
  );
  const querySnapshot = await getDocs(clockRecordQuery);

  if (!querySnapshot.empty) {
    const recordId = querySnapshot.docs[0].id;
    await updateDoc(doc(db, "clockRecords", recordId), {
      clockOut: clockOutTime
    });
    alert("Clock-out recorded!");
  } else {
    alert("No clock-in record found.");
  }
}

// Calculate Payroll (Admin only)
async function calculatePayroll() {
  const employeeId = document.getElementById("payroll-employee-id").value;
  const records = await getDocs(query(
    collection(db, "clockRecords"),
    where("employeeId", "==", employeeId),
    where("clockOut", "!=", null)
  ));

  let totalHours = 0;

  records.forEach((record) => {
    const clockIn = record.data().clockIn.toDate();
    const clockOut = record.data().clockOut.toDate();
    const hoursWorked = (clockOut - clockIn) / (1000 * 60 * 60);
    totalHours += hoursWorked;
  });

  const employee = await doc(db, "employees", employeeId).get();
  const hourlyRate = employee.data().hourlyRate;
  const weeklyPay = totalHours * hourlyRate;

  alert(`Weekly payroll for ${employee.data().name}: $${weeklyPay.toFixed(2)}`);
}
