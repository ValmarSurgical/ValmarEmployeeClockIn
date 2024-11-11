import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const auth = getAuth(app);

document.getElementById('signInButton').addEventListener('click', signIn);

function signIn() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.email === "admin@yourcompany.com") {
                window.location.href = "landing.html"; // Redirect to the landing page
            } else {
                alert("Unauthorized user.");
            }
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert("Login failed: " + errorMessage);
        });
}
