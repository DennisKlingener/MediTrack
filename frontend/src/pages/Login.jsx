import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Login.css'


// FOR THE LOGIN PAGE WE CAN HAVE ONE ROW WITH ONE COLUMN WITH TWO DIVS IN IT.
// ONE DIV CONTAINS THE SIGNUP FORM AND THE OTHER THE SIGN IN FORM.
// DEPENDING ON WHAT THE USER CLICKS ON FROM THE LANDING PAGE (MEDITRACKINDEX.JSX)
// WILL DETERMINE WHICH FORM IS LOADED. THE OTHER WILL BE INVISIABLE.


// INSTEAD OF USING CONDITIONAL RENDERING JUST MAKE A SIGNIN AND LOGIN PAGE IF WE HAVE TIME!!




function Login() {

    // Page navigator
    const navigate = useNavigate();

    // Used to get data from previous page
    const location = useLocation();

    // For conditional rendering of the form divs.
    const [signUpForm, setSignUpForm] = useState(false);
    const [signInForm, setSignInForm] = useState(false);
    
    // Runs immediatly after the page is loaded.
    useEffect(() => {

        // Get the form selected from the previous page  (MediTrackIndex.jsx)
        const data = location.state?.data; 

        // Display the correct form depending on what "form" is.
        if (data.formToLoad == "SIGNUP") {
           setSignUpForm(true);
        } else {
            setSignInForm(true);
        }

    }, []);


    const toggleForms = () => {
        setSignUpForm(!signUpForm);
        setSignInForm(!signInForm);
    }



    // CODE FOR LOGIN \\

    const [signInFormData, setSignInFormData] = useState ({
        userName: "",
        password: "",
    });

    const handleLogin = async () => {

        // Get the entered information
        const data = {
            userName: signInFormData.userName, 
            password: signInFormData.password
        };

        console.log(data);

        try {

            // PUT THIS IN THE ENV!!!!
            const apiURL = "http://159.203.164.160:5000/routes/users/login";

            const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result)

            // Check if the login was successful.
            if (result.loginComplete) {
                navigate("/Profile");
            } else {
                // put an error message here.
                console.log("WIP");
            }   

        } catch (error) {
            console.log(error);
        }
    };

    // END LOGIN CODE \\




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

        // Get the entered data
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

        // Make sure the paswords match. FINISH THIS!!!!
        if (data.password != data.passwordCheck) {
            console.log("Passwords do not match")
            return;
        }

        // Pass the data to the api endpoint
        try {

            // API endpoint URL PUT THIS IN THE ENV!!!!
            const apiURL = "http://159.203.164.160:5000/routes/users/add";

            const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result);

            if (result.signUpComplete) {
                console.log(result.message);
            } else {
                console.log(result.message);
            }

        } catch (err) {
            console.log("Error signing up new user: ", err);
        }
    }

    // END CODE FOR SIGN UP \\





    return (

        <div id='loginContainer' className='container-fluid'>

            <div className="row justify-content-center">

                <div className="col-auto text-center">

                    {signUpForm &&   
                        <div id='signUpForm'>
                            <div className="row">            
                                <div className="signUpFormTitle">Sign Up</div>
                                <div className="col-sm">
                                    {/* first name */}
                                    <div className="form-group mt-2 mb-2">
                                        <label for="firstNameSignUpLabel">First Name</label>
                                        <input
                                            id="firstNameSignUpInput"
                                            className="form-control"
                                            name="firstName"
                                            type="text"
                                            value={signUpFormData.firstName}
                                            onChange={(e) => {
                                                setSignUpFormData({
                                                    ...signUpFormData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }}
                                            placeholder="First Name"
                                        />
                                    </div>

                                    {/* Last name */}
                                    <div className="form-group mt-2 mb-2">
                                        <label for="lastNameSignUpLabel">Last Name</label>
                                        <input
                                            id="lastNameSignUpInput"
                                            className="form-control"
                                            name="lastName"
                                            type="text"
                                            value={signUpFormData.lastName}
                                            onChange={(e) => {
                                                setSignUpFormData({
                                                    ...signUpFormData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }}
                                            placeholder="Last Name"
                                        />
                                    </div>

                                    {/* User name */}
                                    <div className="form-group mt-2 mb-2">
                                        <label for="userNameSignUpLabel">User Name</label>
                                        <input
                                            id="userNameSignUpInput"
                                            className="form-control"
                                            name="userName"
                                            type="text"
                                            value={signUpFormData.userName}
                                            onChange={(e) => {
                                                setSignUpFormData({
                                                    ...signUpFormData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }}
                                            placeholder="User Name"
                                        />
                                    </div>

                                    {/* Phone number */}
                                    <div className="form-group mt-2 mb-2">
                                        <label for="phoneNumberSignUpLabel">Phone Number</label>
                                        <input
                                            id="PhoneNumberSignUpInput"
                                            className="form-control"
                                            name="phoneNumber"
                                            type="tel"
                                            value={signUpFormData.phoneNumber}
                                            onChange={(e) => {
                                                setSignUpFormData({
                                                    ...signUpFormData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }}
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>
                                
                                <div className="col-sm">

                                    {/* Email */}
                                    <div className="form-group mt-2 mb-2">
                                        <label for="emailSignUpLabel">Email</label>
                                        <input
                                            id="emailSignUpInput"
                                            className="form-control"
                                            name="email"
                                            type="email"
                                            value={signUpFormData.email}
                                            onChange={(e) => {
                                                setSignUpFormData({
                                                    ...signUpFormData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }}
                                            placeholder="Email"
                                        />
                                    </div>
                                    
                                    {/* Timezone */}
                                    {/* THIS NEEDS TO BE A DROP DOWN!!!!!!! */}
                                    <div className="form-group mt-2 mb-2">
                                        <label for="timeZoneSignUpLabel">Time Zone</label>
                                        <input
                                            id="timeZoneSignUpInput"
                                            className="form-control"
                                            name="timeZone"
                                            type="text"
                                            value={signUpFormData.timeZone}
                                            onChange={(e) => {
                                                setSignUpFormData({
                                                    ...signUpFormData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }}
                                            placeholder="Time Zone"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="form-group mt-2 mb-2">
                                        <label for="passwordSignUpLabel">Password</label>
                                        <input
                                            id="passwordSignUpInput"
                                            className="form-control"
                                            name="password"
                                            type="password"
                                            value={signUpFormData.password}
                                            onChange={(e) => {
                                                setSignUpFormData({
                                                    ...signUpFormData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }}
                                            placeholder="Password"
                                        />
                                    </div>

                                    {/* Password check */}
                                    <div className="form-group mt-2 mb-2">
                                        <label for="passwordCheckSignUpLabel">Re-type Password</label>
                                        <input
                                            id="passwordCheckSignUpInput"
                                            className="form-control"
                                            name="passwordCheck"
                                            type="password"
                                            value={signUpFormData.passwordCheck}
                                            onChange={(e) => {
                                                setSignUpFormData({
                                                    ...signUpFormData,
                                                    [e.target.name]: e.target.value
                                                });
                                            }}
                                            placeholder="Re-type Password"
                                        />
                                    </div>      
                                </div>
                            </div>
                          
                            <button class="btn btn-primary mt-2 mb-2" onClick={handleSignUp}>Sign Up</button>
                            <div>Already a member? <a href="#" onClick={toggleForms}>Login.</a></div>
                            
                            
                        </div> 
                    }

                    {signInForm && 
                        <div id="signInForm">

                            <div id="signInFormTitle">Sign-In</div>

                            <div className="form-group mt-2 mb-2">
                                <label for="userNameLoginLabel">Username</label>
                                <input 
                                    id="userNameInputLogin"
                                    className='form-control'
                                    name="userName"
                                    type="text" 
                                    value={signInFormData.userName}
                                    onChange={(e) => {
                                        setSignInFormData({
                                            ...signInFormData,
                                            [e.target.name]: e.target.value
                                        });
                                    }}
                                    placeholder="Username"/>
                            </div>
                            
                            <div className="form-group mt-2 mb-2">
                                <label for="passwordLoginLabel">Password</label>
                                <input 
                                    id="passwordInputLogin"
                                    className='form-control'  
                                    name="password"
                                    type="text" 
                                    value={signInFormData.password}
                                    onChange={(e) => {
                                        setSignInFormData({
                                            ...signInFormData,
                                            [e.target.name]:e.target.value
                                        });
                                    }}
                                    placeholder="Password"/>
                            </div>

                            <button class="btn btn-primary mt-2 mb-2" onClick={handleLogin}>Submit</button>
                            <div>Not a member? <a href="#" onClick={toggleForms}>Sign up.</a></div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};


export default Login;