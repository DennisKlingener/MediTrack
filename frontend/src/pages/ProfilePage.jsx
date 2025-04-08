import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useView } from '../../viewContext';    // Function to change views. Exported becasue navbar needs it aswell.
import '../styles/ProfilePage.css';

function ProfilePage() {
    
    const {tableView, newMedView, medInfoView, switchViewMode} = useView();

    const [medData, setMedData] = useState([]);
    const [newMedFormData, setNewMedFormData] = useState({
        medName: "",
        currentQuantity: "",
        timeToTakeAt: "",
        isTimeAM: "",
        amountToTake: "",
        refillQuantity: "",
    });
    const isAmRef = useState(null);

    // Controls the div when a med in the table is selected.
    const [medInfoToDisplay, setMedInfoToDisplay] = useState(0);

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
            isTimeAM: (isAmRef.current.checked ? "1" : "0"),
        };


        console.log("Here is new med data: ", data);

        
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

    const deleteMed = async (medNameToDelete) => {

        // Get the API route
        const apiURL = "http://159.203.164.160:5000/routes/medications/delete/" + medNameToDelete;

        console.log("here is apiURL:", apiURL);

        // make the call.
        const response = await fetch(apiURL, {
            method: "DELETE",
            credentials: "include",
        });

        const result = await response.json();
        console.log("Delete med res: ", result);
    }

    const handleRowClick = (rowIndex) => {
        setMedInfoToDisplay(rowIndex);
        switchViewMode("medInfoView");
    }
    
    return (
        <div id="profilePageContainer" className="container-fluid">

            <div className='row'>
                <Navbar />
            </div>

            <div id='profilePageParent' className='row justify-content-center'>
                    
                { tableView && 
                    <div id='userPanel' className="col-auto text-center">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                <th scope="col">Medication</th>
                                <th scope="col">Reminder Time</th>
                                <th scope="col">Current Quantity</th>
                                </tr>
                            </thead>
                            <tbody>

                                 {/* Dynamically allocated table */}
                                { medData.map(
                                    // for Each row in medData
                                    (row, rowIndex) => ( 
                                        <tr key={rowIndex} onClick={() => handleRowClick(rowIndex)}>
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
                            
                            <div className='col'>
                                {/* Medication Name */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedNameLabel">New medication name</label>
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
                                        placeholder='Medication name'
                                    />
                                </div>

                                {/* Medication Quantity */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedCurrentQuantityLabel">Current quantity</label>
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
                                        placeholder='How many pills do you currently have?'
                                    />
                                </div>

                                {/* Amount to take */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedAmountToTakeLabel">Amount to take</label>
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
                                    <label for="newMedTimeToTakeAtLabel">When do you take your medication</label>
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
                                        <option>1:00</option>
                                        <option>2:00</option>
                                        <option>3:00</option>
                                        <option>4:00</option>
                                        <option>5:00</option>
                                        <option>6:00</option>
                                        <option>7:00</option>
                                        <option>8:00</option>
                                        <option>9:00</option>
                                        <option>10:00</option>
                                        <option>11:00</option>
                                        <option>12:00</option>
                                    </select>
                                </div>
                            
                                <input 
                                    id="newMedAmCheck"
                                    className="form-check-input"
                                    name='isTimeAM' 
                                    type="checkbox"  
                                    ref={isAmRef}
                                />
                                <label class="form-check-label" for="flexCheckDefault">AM</label>

                                {/* Refill Quantity */}
                                <div className="form-group mt-2 mb-2">
                                    <label for="newMedRefillQuantityLabel">Refill amount</label>
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

                        <button className="btn btn-primary mt-2 mb-2 mr-1" onClick={() => {addNewMed(); switchViewMode("tableView");}}>Add</button>
                        <button className='btn btn-primary mt-2 mb-2 ml-1' onClick={() => {switchViewMode("tableView");}}>Cancel</button>
                    </div>
                }

                { medInfoView && 
                    <div id='medInfoView' className="col-auto text-center">
                        
                        <h1 id="medInfoViewName">{medData[medInfoToDisplay]?.MED_NAME}</h1>

                        <div id='colsParent' className="row">

                            <div id='leftCol' className="col-auto text-center">
                                <h2>Current quantity: {medData[medInfoToDisplay]?.CURRENT_QUANTITY}</h2>
                                <h2>Amount to take: {medData[medInfoToDisplay]?.AMOUNT_TO_TAKE}</h2>
                            </div>

                            <div id='rightCol' className="col-auto text-center">
                                <h2>Refill amount: {medData[medInfoToDisplay]?.REFILL_QUANTITY}</h2>
                                <h2>Time to take at: {medData[medInfoToDisplay]?.TIME_TO_TAKE_AT}</h2>
                            </div>
                        </div>

                        <button onClick={() => {switchViewMode("tableView")}} className='btn btn-primary'>Back</button>
                        <button onClick={() => {
                            deleteMed(medData[medInfoToDisplay]?.MED_NAME);
                            switchViewMode("tabelView");
                            }}
                        className='btn btn-primary'>Delete</button>
                        
                    </div>
                }
                        
            </div>
        </div>
    );
};

export default ProfilePage;