import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar"; 



import '../styles/MediTrackIndex.css'


function MediTrackIndex() {

    // Initialize the useNavigate hook
    const navigate = useNavigate();

    // In the future make this load the correct from login or signup 
    // depending on which button was pressed
    const navigateToLoginPage = (form) => {

        const data = {formToLoad: form};

        navigate('/Login', {state: { data:data } });
    };
        
    return (
        <div id='MediTrackIndexContainer' className="container-fluid">

            <div id="titleParent" className="row justify-content-center">

                <div className="col-auto">
                    <h1 id="title">Medi-Track</h1>
                    <h6>MediTrack — Your Daily Dose of Peace of Mind</h6>
                </div>

            </div>

            <div id="appDesc" className='row justify-content-center'>

                Welcome to MediTrack — Your Personal Medication Reminder<br/>

                Managing medications can be overwhelming, but it doesn{"\u2019"}t have to be.<br/>
                MediTrack makes it simple to stay on top of your health by helping you organize your medications<br/>
                and sending you daily reminders when it{"\u2019"}s time to take them.<br/><br/>

                Easily add your medications, set important details like dosage and time, and let MediTrack handle the rest.<br/>
                Whether it's a morning vitamin or an evening prescription, you'll never miss a dose again!<br/>

            </div>

            <div id="signinSignup" className="row justify-content-center">

                <div className="col-auto">
                    <button type='button' className='btn btn-primary btn-control' onClick={() => navigateToLoginPage("SIGNIN")}>sign-in</button>
                </div>

                <div className="col-auto">
                    <button type='button' className='btn btn-primary btn-control' onClick={() => navigateToLoginPage("SIGNUP")}>sign-up</button>
                </div>

            </div>
        
        </div> 
    );
}


export default MediTrackIndex;