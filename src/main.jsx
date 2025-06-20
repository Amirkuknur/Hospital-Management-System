import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Appointment from './pages/Appointment.jsx'
import DoctorList from './pages/Doctors.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
<App></App>

  </StrictMode>,
)
