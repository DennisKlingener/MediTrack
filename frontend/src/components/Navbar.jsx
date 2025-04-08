import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useView } from '../../viewContext.jsx';
import "../styles/Navbar.css";

function navbar() {

    const [isSignedIn, setIsSignedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const {switchViewMode} = useView();

    useEffect(() => {
        if (location.pathname == "/Profile") {
            setIsSignedIn(true);
        } else {
            setIsSignedIn(false);
        }
    }, []);

    const returnToHome = () => {
        navigate("/");
    }

    return (
        
        <div id="navbarParent" className="row-auto d-flex justify-content-center">
            {isSignedIn && <button className="btn btn-primary" onClick={returnToHome}>Sign out</button>}
            {isSignedIn && <button className="btn btn-primary" onClick={() => switchViewMode("newMedView")}>Add new medication</button>}
            {!isSignedIn && <button className="btn btn-primary" onClick={returnToHome}>Home</button>}
        </div>
    );

}

export default navbar;