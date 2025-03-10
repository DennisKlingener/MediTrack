import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/kjh'


// FOR THE LOGIN PAGE WE CAN HAVE ONE ROW WITH ONE COLUMN WITH TWO DIVS IN IT.
// ONE DIV CONTAINS THE SIGNUP FORM AND THE OTHER THE SIGN IN FORM.
// DEPENDING ON WHAT THE USER CLICKS ON FROM THE LANDING PAGE (MEDITRACKINDEX.JSX)
// WILL DETERMINE WHICH FORM IS LOADED. THE OTHER WILL BE INVISIABLE.


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
                        <div id='signInForm'>

                            <h1>Sign In</h1>
                            <h2>Put form here</h2>

                        </div> 
                    }


                </div>

            </div>






        </div>
    );
};


export default Login;