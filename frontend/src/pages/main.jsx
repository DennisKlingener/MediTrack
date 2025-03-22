import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'; // FOR BOOTSTRAP
import '../styles/index.css' // GLOBAL STYLES


// PAGES
import MediTrackIndex from './MediTrackIndex.jsx'
import Login from './Login.jsx';
import ProfilePage from './ProfilePage.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>  
      <Routes>

        <Route path='/' element={<MediTrackIndex />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Profile' element={<ProfilePage />} />

      </Routes>
    </Router>
  </StrictMode>
);
