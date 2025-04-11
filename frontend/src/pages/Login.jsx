import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth'; // If using Firebase for Google Sign-In
import { auth, provider } from './firebaseConfig'; // Assuming you have Firebase config
import Navbar from './Navbar'; // Assuming you have a Navbar component
import { auth, provider } from '../config/fireBaseAuth';

const Login = () => {
    const [signUpForm, setSignUpForm] = useState(false);
    const [signInForm, setSignInForm] = useState(false);
    const [signInFormData, setSignInFormData] = useState({
        userName: "",
        password: "",
    });
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

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const data = location.state?.data;
        if (data?.formToLoad === "SIGNUP") {
            setSignUpForm(true);
        } else {
            setSignInForm(true);
        }
    }, []);

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

    const handleLogin = async () => {
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
                console.log("WIP");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignUp = async () => {
        const data = { ...signUpFormData };

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
            console.log(result.message);
        } catch (err) {
            console.log("Error signing up new user: ", err);
        }
    };

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
                setMessage(responseData.message);
            }
        } catch (error) {
            console.error("Google login error:", error);
            setMessage("Google login failed.");
        }
    };

    return (
        <div id='loginContainer' className='container-fluid'>
            <div id='navbar' className='row'>
                <Navbar />
            </div>
            <div id="loginParent" className="row justify-content-center">
                <div className="col-auto text-center">
                    {signUpForm && (
                        <div id='signUpForm'>
                            {/* Sign up form implementation */}
                            <button className="btn btn-primary mt-2 mb-2" onClick={handleSignUp}>Sign Up</button>
                            <div>Already a member? <a href="#" onClick={toggleForms}>Login.</a></div>
                        </div>
                    )}
                    {signInForm && (
                        <div id="signInForm">
                            {/* Sign in form implementation */}
                            <button className="btn btn-primary mt-2 mb-2" onClick={handleLogin}>Login</button>
                            <div>Not a member? <a href="#" onClick={toggleForms}>Sign up.</a></div>
                            <button className="googleSignInButton mt-3" onClick={loginWithGoogle}>
                                Sign in with Google
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
