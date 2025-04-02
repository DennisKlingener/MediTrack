import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProfilePage.css'

function ProfilePage() {

    // Upon page load, make a query for all the users medis using the id from the jwt token
    // dynamically init the table with all the users data.

    const [tableView, setTableView] = useState(true);
    const [newMedView, setNewMedView] = useState(false);


    const [medData, setMedData] = useState([]);
    const [newMedFormData, setNewMedFormData] = useState({
        medName: "",
        currentQuantity: "",
        timeToTakeAt: "",
        isTimeAM: "",
        amountToTake: "",
        refillQuantity: "",
    });

    // Runs immediatly after the page is loaded.
    useEffect(() => {
        async function getUserMedInfo() {
            // Call the apiendppint.
            const apiURL = "http://159.203.164.160:5000/routes/medications/usermeds";

            const response = await fetch(apiURL, {
                method: "GET",
                credentials: "include", // Required to send cookies
            });

            const result = await response.json();
            setMedData(result);
        }
        getUserMedInfo();
    }, []);

    const addNewMed = async () => {

        const data = {
            medName: newMedFormData.medName,
            currentQuantity: newMedFormData.currentQuantity,
            amountToTake: newMedFormData.amountToTake,
            refillQuantity: newMedFormData.refillQuantity,
            timeToTakeAt: newMedFormData.timeToTakeAt,
            isTimeAM: newMedFormData.isTimeAM,
        };

        console.log("New Med Data:", data);

        // Call the endpoint
        try {

            const apiURL = "http://159.203.164.160:5000/routes/medications/add";

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

        } catch (err) {
            console.log("Error adding new medication: ", err);
        }

        // ADD SUCCESS NOTIF
    }

    const toggleViewMode = () => {
        if (tableView) {
            setTableView(false);
            setNewMedView(true);
        } else {
            setNewMedView(false);
            setTableView(true);
        }
    }
    
    return (
        <div id="profilePageContainer" className="container-fluid">
            <div className='row justify-content-center'>
                    
                { tableView && 
                    <div id='userPanel' className="col-auto text-center">
                        <div className='row-auto'>
                            <button onClick={toggleViewMode}>+</button>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">Medication</th>
                                <th scope="col">Reminder Time</th>
                                <th scope="col">Current Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Dynamically allocated table* */}
                                { medData.map(
                                    // for Each row in medData
                                    (row) => ( 
                                        <tr>
                                            <td>{row.MED_NAME}</td>
                                            <td>{row.TIME_TO_TAKE_AT + (row.IS_TIME_AM ? "AM" : "PM")}</td>
                                            <td>{row.CURRENT_QUANTITY}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                }
        
                { newMedView &&         
                    <div id="newMedForm" className="col-auto text-center">

                        <div className="row">
                            <div id='newMedFormTitle'>New Medication</div>
                            <div className='col-sm'>
                                {/* Medication Name */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedNameLabel">Medication Name</label>
                                    <input 
                                        id="newMedNameInput"
                                        className="form-control"
                                        name='medName'
                                        type='text'
                                        value={newMedFormData.medName}
                                        onChange={(e) => {
                                            setNewMedFormData({
                                                ...newMedFormData,
                                                [e.target.name]: e.target.value
                                            });
                                        }}
                                        placeholder='Medication Name'
                                    />
                                </div>

                                {/* Medication Quantity */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedCurrentQuantityLabel">Current Quantity</label>
                                    <input 
                                        id="newMedCurrentQuantityInput"
                                        className="form-control"
                                        name='currentQuantity'
                                        type='number'
                                        value={newMedFormData.currentQuantity}
                                        onChange={(e) => {
                                            setNewMedFormData({
                                                ...newMedFormData,
                                                [e.target.name]: e.target.value
                                            });
                                        }}
                                        placeholder='How many pills currently held?'
                                    />
                                </div>

                                {/* Amount to take */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedAmountToTakeLabel">Amount To Take</label>
                                    <input 
                                        id="newMedAmountToTakeInput"
                                        className="form-control"
                                        name='amountToTake'
                                        type='text'
                                        value={newMedFormData.amountToTake}
                                        onChange={(e) => {
                                            setNewMedFormData({
                                                ...newMedFormData,
                                                [e.target.name]: e.target.value
                                            });
                                        }}
                                        placeholder='How many pills do you take per dose?'
                                    />
                                </div>

                                {/* Time To Take At */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedTimeToTakeAtLabel">TimeToTakeAt</label>
                                    <select 
                                        id='newMedTimeToTakeAt'
                                        class="form-select" 
                                        name='timeToTakeAt'
                                        value={newMedFormData.timeToTakeAt}
                                        onChange={(e) => {
                                            setNewMedFormData({
                                                ...newMedFormData,
                                                [e.target.name]: e.target.value
                                            });
                                        }} 
                                    >
                                        <option selected>1:00</option>
                                        <option value="1">2:00</option>
                                        <option value="2">3:00</option>
                                        <option value="3">4:00</option>
                                        <option selected>5:00</option>
                                        <option value="1">6:00</option>
                                        <option value="2">7:00</option>
                                        <option value="3">8:00</option>
                                        <option selected>9:00</option>
                                        <option value="1">10:00</option>
                                        <option value="2">11:00</option>
                                        <option value="3">12:00</option>
                                    </select>
                                </div>
                            
                                <input 
                                    id="newMedAmCheck"
                                    className="form-check-input"
                                    name='isTimeAM' 
                                    type="checkbox" 
                                    value={newMedFormData.isTimeAM} 
                                    onChange={(e) => {
                                        setNewMedFormData({
                                            ...newMedFormData,
                                            [e.target.name]: e.target.checked ? 1 : 0
                                        });
                                    }}
                                />
                                <label class="form-check-label" for="flexCheckDefault">AM</label>

                                {/* Refill Quantity */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedRefillQuantityLabel">Refill Amount</label>
                                    <input 
                                        id="newMedRefillQuantityInput"
                                        className="form-control"
                                        name='refillQuantity'
                                        type='number'
                                        value={newMedFormData.refillQuantity}
                                        onChange={(e) => {
                                            setNewMedFormData({
                                                ...newMedFormData,
                                                [e.target.name]: e.target.value
                                            });
                                        }}
                                        placeholder='How many pills does your doctor prescribe?'
                                    />
                                </div>
                            </div>




                        </div>

                        <button class="btn btn-primary mt-2 mb-2" onClick={() => {addNewMed(); toggleViewMode();}}>Add</button>
                    </div>
                }
                        
            </div>
        </div>
    );
};

export default ProfilePage;