import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProfilePage.css'

function ProfilePage() {

    // Upon page load, make a query for all the users medis using the id from the jwt token
    // dynamically init the table with all the users data.

    const [medData, setMedData] = useState([]);


    // Runs immediatly after the page is loaded.
    useEffect(async () => {

        // Call the apiendppint.
        const apiURL = "http://159.203.164.160:5000/routes/medications/usermeds";

        const response = await fetch(apiURL, {
            method: "GET",
            credentials: "include", // Required to send cookies
        });

        const result = await response.json();
        setMedData(result);
    }, []);

    


    return (

        <div id="profilePageContainer" className="container-fluid">

            <div className='row justify-content-center'>

                <div id='userPanel' className="col-auto text-center">

                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">Medication</th>
                            <th scope="col">Reminder Time</th>
                            <th scope="col">Current Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Dynamically allocated table*/}
                            { medData.map(
                                // for Each row in medData
                                (row) => ( 
                                    <tr>
                                        <td>{row.MED_NAME}</td>
                                        <td>{row.TIME_TO_TAKE_AT + row.IS_TIME_AM ? "AM" : "PM"}</td>
                                        <td>{row.CURRENT_QUANTITY}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>


    );




};

export default ProfilePage;