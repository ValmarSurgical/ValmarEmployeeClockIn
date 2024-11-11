// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp, doc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
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
const auth = getAuth(app); // Firebase Authentication instance
const db = getFirestore(app); // Firestore instance

// Sign-in function
document.getElementById('signInButton').addEventListener('click', signIn);

function signIn() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  // Firebase sign-in (v9 syntax)
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Signed in as:", user.email);
      // Redirect or show logged-in UI
      window.location.href = "dashboard.html"; // or another page
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error signing in:", errorCode, errorMessage);
      alert("Login failed: " + errorMessage); // Show error message
    });
}

// Clock In function
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

// Clock Out function
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

// Calculate Payroll function (Admin only)
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
    const hoursWorked = (clockOut - clockIn) / (1000 * 60 * 60); // Convert ms to hours
    totalHours += hoursWorked;
  });

  const employee = await doc(db, "employees", employeeId).get();
  const hourlyRate = employee.data().hourlyRate;
  const weeklyPay = totalHours * hourlyRate;

  alert(`Weekly payroll for ${employee.data().name}: $${weeklyPay.toFixed(2)}`);
}

