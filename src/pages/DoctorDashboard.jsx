import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, FileText, Edit, LogOut, Home, PlusCircle, MinusCircle } from 'lucide-react';
import { MdMedicalServices } from 'react-icons/md';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

   useEffect(() => {
      const fetchAppointments = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("User not authenticated. Please log in.");
          }
      
          const response = await fetch("http://localhost:8800/allAppointments", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch appointments");
          }
      
          const data = await response.json();
          setAppointments(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
  
      fetchAppointments();
    }, []);

  const handleLogout = () => {
    navigate('/login');
  };
  const handleCancelDoctor = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8800/doctor/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel appointment: ${errorText}`);
      }

      const message = await response.text();
      alert(message);

      setDoctors((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error("Error Deleting Doctor:", error);
      alert(error.message);
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-8">HMS Portal</h2>
          <div className="space-y-2">
            <button onClick={() => setActiveTab('appointments')} className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}> 
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}> 
              <User className="mr-2 h-4 w-4" />
              Profile
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 rounded-lg hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
          {activeTab === 'appointments' && (
            <div className="p-6 bg-white rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Appointments</h2>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)}>
                      <div className="flex items-center space-x-4">
                        {expandedId === appointment.id ? <MinusCircle className="text-gray-600 w-5 h-5" /> : <PlusCircle className="text-gray-600 w-5 h-5" />}
                        <Calendar className="text-blue-500 w-4 h-4" />
                        <span className="text-gray-700">{appointment.appointmentDate}</span>
                        <Clock className="text-green-500 w-4 h-4" />
                        <span className="text-gray-700">{appointment.appointmentTime}</span>
                      </div>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${expandedId === appointment.id ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <User className="text-gray-500 w-4 h-4" />
                          <span className="text-gray-600">Patient:</span>
                          <span className="font-medium">{appointment.patient.name}</span>
                          <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(appointment.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      Delete
                    </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Profile</h2>
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p>Dr. John Doe</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Specialization</label>
                <p>Cardiologist</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
