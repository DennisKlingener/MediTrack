import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import '../styles/MediTrackIndex.css'


function MediTrackIndex() {

    // Initialize the useNavigate hook
    const navigate = useNavigate();

    // In the future make this load the correct from login or signup 
    // depending on which button was pressed
    const navigateToLoginPage = (form) => {

        const data = {formToLoad: form};

        console.log("Form is: " + form);

        navigate('/Login', {state: { data:data } });
    };
        
    return (
        <div id='MediTrackIndexContainer' className="container-fluid">

            <div className='row justify-content-center'>

                <div className="col-auto">
                    NAVBAR? MAKE A COMPONENT FOR THIS.
                </div>

            </div>

            <div className="row justify-content-center">

                <div className="col-auto">
                    <h1 id="title">Medi-Track</h1>
                </div>

            </div>
        
            <div className="row justify-content-center">

                <div className="col-auto">
                    <button type='button' className='btn btn-primary' onClick={() => navigateToLoginPage("SIGNIN")}>sign-in</button>
                </div>

                <div className="col-auto">
                    <button type='button' className='btn btn-primary' onClick={() => navigateToLoginPage("SIGNUP")}>sign-up</button>
                </div>

            </div>
        
        
        </div> 
    );
}


export default MediTrackIndex;