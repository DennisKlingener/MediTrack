import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/CompleteProfile.css'



/**Where I left off:
 * We need use states to store the rest of the new users info
 * we wont need passwords for users who use google to signup
 * Need to generate the jwt token from here and move to profile OR send the user back to the sign in
 * modify the messages on the form 
 */


function CompleteProfile() {

    // Page navigator
    const navigate = useNavigate();

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
            password: "google-signin",
            passwordCheck: "google-signin",
        };  

        // Pass the data to the api endpoint
        try {

            // API endpoint URL PUT THIS IN THE ENV!!!!
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
            console.log(result);

            if (result.signUpComplete) {
                console.log(result.message);
                const data = {formToLoad: "SIGNIN"};
                navigate("/Login", {state: {data:data}});
            } else {
                console.log(result.message);
            }

        } catch (err) {
            console.log("Error signing up new user: ", err);
        }
    }

    return (

        <div id='completeProfileParent' className="container-fluid">

            <div className="row">
                <Navbar/>
            </div>
            
            <div id='formParent' className="row justify-content-center">

                <div className="col-auto text-center">

                    <div id='signUpForm'>

                        <div className="row">            
                            <div id="signUpFormTitle">Finish Your Profile!</div>
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

                            </div>
                            
                            <div className="col-sm">

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
                                <div className="form-group mt-2 mb-2">
                                    <label for="timeZoneSignUpLabel">Time Zone</label>
                                    <select
                                        id="timeZoneSignUpInput"
                                        className="form-control"
                                        name="timeZone"
                                        value={signUpFormData.timeZone}
                                        onChange={(e) => {
                                            setSignUpFormData({
                                                ...signUpFormData,
                                                [e.target.name]: e.target.value
                                            });
                                        }}
                                        placeholder="Time Zone"
                                    >
                                        <option>EASTERN TIME</option>
                                        <option>CENTRAL TIME</option>
                                        <option>MOUNTAIN TIME</option>
                                        <option>PACIFIC TIME</option>
                                        <option>ALASKA TIME</option>
                                        <option>HAWAII TIME</option>
                                        <option>SAMOA TIME</option>
                                        <option>CHAMORRO TIME</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary mt-2 mb-2" onClick={handleSignUp}>Finish</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompleteProfile;