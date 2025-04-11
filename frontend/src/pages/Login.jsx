import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Login.css';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = { 
  apiKey: "AIzaSyCMEQtFODLC9rZwdkT_mb3F1Gusu_1IU-g",
  authDomain: "meditrack-dualauth.firebaseapp.com",
  projectId: "meditrack-dualauth",
  storageBucket: "meditrack-dualauth.firebasestorage.app",
  messagingSenderId: "947596501774",
  appId: "1:947596501774:web:f381a371c54a5830aa2d5f",
  measurementId: "G-K3J4LGNFMS"
};

// Initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Login() {
    // Page navigator
    const navigate = useNavigate();

    // Used to get data from previous page
    const location = useLocation();

    // For conditional rendering of the form divs.
    const [signUpForm, setSignUpForm] = useState(false);
    const [signInForm, setSignInForm] = useState(false);

    // Runs immediately after the page is loaded.
    useEffect(() => {
        // Get the form selected from the previous page (MediTrackIndex.jsx)
        const data = location.state?.data;

        // Display the correct form depending on what "form" is.
        if (data?.formToLoad === "SIGNUP") {
            setSignUpForm(true);
        } else {
            setSignInForm(true);
        }
    }, [location]);

    const toggleForms = () => {
        setSignUpForm(!signUpForm);
        setSignInForm(!signInForm);
        setSignInFormData({
            userName: "",
            password: "",
        });
        setSignUpFormData({
            firstName: "",
            lastName: "",
            userName: "",
            phoneNumber: "",
            email: "",
            timeZone: "",
            password: "",
            passwordCheck: "",
        });
    };

    // CODE FOR LOGIN \\
    const [signInFormData, setSignInFormData] = useState({
        userName: "",
        password: "",
    });

    const handleLogin = async () => {
        // Get the entered information
        const data = {
            userName: signInFormData.userName,
            password: signInFormData.password,
        };

        try {
            const apiURL = "http://159.203.164.160:5000/routes/users/login";
            const response = await fetch(apiURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.loginComplete) {
                navigate("/Profile");
            } else {
                console.log("Login failed");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // CODE FOR SIGN UP \\
    const [signUpFormData, setSignUpFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        phoneNumber: "",
        email: "",
        timeZone: "",
        password: "",
        passwordCheck: "",
    });

    const handleSignUp = async () => {
        const data = {
            firstName: signUpFormData.firstName,
            lastName: signUpFormData.lastName,
            userName: signUpFormData.userName,
            phoneNumber: signUpFormData.phoneNumber,
            email: signUpFormData.email,
            timeZone: signUpFormData.timeZone,
            password: signUpFormData.password,
            passwordCheck: signUpFormData.passwordCheck,
        };

        // Check if the passwords match
        if (data.password !== data.passwordCheck) {
            console.log("Passwords do not match");
            return;
        }

        try {
            const apiURL = "http://159.203.164.160:5000/routes/users/add";
            const response = await fetch(apiURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.signUpComplete) {
                console.log(result.message);
            } else {
                console.log(result.message);
            }
        } catch (err) {
            console.log("Error signing up new user: ", err);
        }
    };

    // GOOGLE SIGNUP
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const response = await fetch("http://159.203.164.160:5000/routes/users/google-login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
                credentials: 'include',
            });
            const responseData = await response.json();
            if (responseData.loginComplete) {
                navigate("/Profile");
            } else {
                console.log(responseData.message);
            }
        } catch (error) {
            console.error("Google login error:", error);
            console.log("Google login failed.");
        }
    };

    return (
        <div id="loginContainer" className="container-fluid">
            <div id="navbar" className="row">
                <Navbar />
            </div>

            <div id="loginParent" className="row justify-content-center">
                <div className="col-auto text-center">

                    {signUpForm && (
                        <div id="signUpForm">
                            <div className="row">
                                <div id="signUpFormTitle">Sign Up</div>
                                <div className="col-sm">
                                    <div className="form-group mt-2 mb-2">
                                        <label htmlFor="firstNameSignUpLabel">First Name</label>
                                        <input
                                            id="firstNameSignUpInput"
                                            className="form-control"
                                            name="firstName"
                                            type="text"
                                            value={signUpFormData.firstName}
                                            onChange={(e) => setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value })}
                                            placeholder="First Name"
                                        />
                                    </div>

                                    <div className="form-group mt-2 mb-2">
                                        <label htmlFor="lastNameSignUpLabel">Last Name</label>
                                        <input
                                            id="lastNameSignUpInput"
                                            className="form-control"
                                            name="lastName"
                                            type="text"
                                            value={signUpFormData.lastName}
                                            onChange={(e) => setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value })}
                                            placeholder="Last Name"
                                        />
                                    </div>

                                    <div className="form-group mt-2 mb-2">
                                        <label htmlFor="userNameSignUpLabel">User Name</label>
                                        <input
                                            id="userNameSignUpInput"
                                            className="form-control"
                                            name="userName"
                                            type="text"
                                            value={signUpFormData.userName}
                                            onChange={(e) => setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value })}
                                            placeholder="User Name"
                                        />
                                    </div>

                                    <div className="form-group mt-2 mb-2">
                                        <label htmlFor="phoneNumberSignUpLabel">Phone Number</label>
                                        <input
                                            id="PhoneNumberSignUpInput"
                                            className="form-control"
                                            name="phoneNumber"
                                            type="tel"
                                            value={signUpFormData.phoneNumber}
                                            onChange={(e) => setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value })}
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <div className="form-group mt-2 mb-2">
                                        <label htmlFor="emailSignUpLabel">Email</label>
                                        <input
                                            id="emailSignUpInput"
                                            className="form-control"
                                            name="email"
                                            type="email"
                                            value={signUpFormData.email}
                                            onChange={(e) => setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value })}
                                            placeholder="Email"
                                        />
                                    </div>

                                    <div className="form-group mt-2 mb-2">
                                        <label htmlFor="timeZoneSignUpLabel">Time Zone</label>
                                        <select
                                            id="timeZoneSignUpInput"
                                            className="form-control"
                                            name="timeZone"
                                            value={signUpFormData.timeZone}
                                            onChange={(e) => setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value })}
                                        >
                                            <option value="EASTERN TIME">EASTERN TIME</option>
                                            <option value="CENTRAL TIME">CENTRAL TIME</option>
                                            <option value="MOUNTAIN TIME">MOUNTAIN TIME</option>
                                            <option value="PACIFIC TIME">PACIFIC TIME</option>
                                            <option value="ALASKA TIME">ALASKA TIME</option>
                                            <option value="HAWAII TIME">HAWAII TIME</option>
                                            <option value="SAMOA TIME">SAMOA TIME</option>
                                            <option value="CHAMORRO TIME">CHAMORRO TIME</option>
                                        </select>
                                    </div>

                                    <div className="form-group mt-2 mb-2">
                                        <label htmlFor="passwordSignUpLabel">Password</label>
                                        <input
                                            id="passwordSignUpInput"
                                            className="form-control"
                                            name="password"
                                            type="password"
                                            value={signUpFormData.password}
                                            onChange={(e) => setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value })}
                                            placeholder="Password"
                                        />
                                    </div>

                                    <div className="form-group mt-2 mb-2">
                                        <label htmlFor="passwordCheckSignUpLabel">Re-type Password</label>
                                        <input
                                            id="passwordCheckSignUpInput"
                                            className="form-control"
                                            name="passwordCheck"
                                            type="password"
                                            value={signUpFormData.passwordCheck}
                                            onChange={(e) => setSignUpFormData({ ...signUpFormData, [e.target.name]: e.target.value })}
                                            placeholder="Re-type Password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary mt-2 mb-2" onClick={handleSignUp}>Sign Up</button>
                            <div>Already a member? <a href="#" onClick={toggleForms}>Login.</a></div>
                        </div>
                    )}

                    {signInForm && (
                        <div id="signInForm">
                            <div id="signInFormTitle">Sign In</div>

                            <div className="form-group mt-2 mb-2">
                                <label htmlFor="userNameLoginLabel">Username</label>
                                <input
                                    id="userNameInputLogin"
                                    className="form-control"
                                    name="userName"
                                    type="text"
                                    value={signInFormData.userName}
                                    onChange={(e) => setSignInFormData({ ...signInFormData, [e.target.name]: e.target.value })}
                                    placeholder="Username"
                                />
                            </div>

                            <div className="form-group mt-2 mb-2">
                                <label htmlFor="passwordLoginLabel">Password</label>
                                <input
                                    id="passwordInputLogin"
                                    className="form-control"
                                    name="password"
                                    type="password"
                                    value={signInFormData.password}
                                    onChange={(e) => setSignInFormData({ ...signInFormData, [e.target.name]: e.target.value })}
                                    placeholder="Password"
                                />
                            </div>

                            <button className="btn btn-primary mt-2 mb-2" onClick={handleLogin}>Submit</button>
                            <div>Not a member? <a href="#" onClick={toggleForms}>Sign up.</a></div>

                            <button className="googleSignInButton mt-3" onClick={loginWithGoogle}>
                                <img src="/images/google-icon.png" alt="Google icon" className="googleIcon" />
                                Sign in with Google
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
