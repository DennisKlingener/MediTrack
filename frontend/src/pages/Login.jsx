import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Login.css'


// FOR THE LOGIN PAGE WE CAN HAVE ONE ROW WITH ONE COLUMN WITH TWO DIVS IN IT.
// ONE DIV CONTAINS THE SIGNUP FORM AND THE OTHER THE SIGN IN FORM.
// DEPENDING ON WHAT THE USER CLICKS ON FROM THE LANDING PAGE (MEDITRACKINDEX.JSX)
// WILL DETERMINE WHICH FORM IS LOADED. THE OTHER WILL BE INVISIABLE.


// INSTEAD OF USING CONDITIONAL RENDERING JUST MAKE A SIGNIN AND LOGIN PAGE IF WE HAVE TIME!!




function Login() {

    // Used to get data from previous page
    const location = useLocation();

    // For conditional rendering of the form divs.
    const [signUpForm, setSignUpForm] = useState(false);
    const [signInForm, setSignInForm] = useState(false);
  
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

    


    // LOGIN

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

            // MAKE THIS A GITLAB SECRET!
            const apiURL = "http://159.203.164.160:5000/users/login";

            const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result)

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div id='loginContainer' className='container-fluid'>

            <div className="row justify-content-center">

                <div className="col-auto text-center">

                    {signUpForm && 
                        <div id='signUpForm'>

                            <h1>Sign Up</h1>
                            <h2>Put form here</h2>

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
                                <input type="text" className='form-control' id="passwordInputLogin" placeholder="Password"/>
                            </div>

                            <button class="btn btn-primary mt-2 mb-2" onClick={handleLogin}>Submit</button>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
};


export default Login;