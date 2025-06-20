import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User,Phone,IndianRupee,Award, FileText, Plus, Edit, LogOut, Home ,PlusCircle, MinusCircle,Download} from 'lucide-react';
import { MdMedicalServices } from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
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

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage (or wherever it's stored)
  
      const response = await fetch(`http://localhost:8800/appointment/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Add Authorization header
          "Content-Type": "application/json"
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel appointment: ${errorText}`);
      }
  
      const message = await response.text();
      alert(message);
  
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert(error.message);
    }
  };
  

  const handleReschedule = async (id) => {
    const newDate = prompt("Enter new appointment date (YYYY-MM-DD):");
    const newTime = prompt("Enter new appointment time (HH:MM:SS):");
  
    if (!newDate || !newTime) {
      alert("Date and time are required to reschedule.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8800/user/appointments/reschedule/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentDate: newDate, appointmentTime: newTime }),
      });
      const message = await response.text();
      alert(message);
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id
            ? { ...appt, appointmentDate: newDate, appointmentTime: newTime, status: "RESCHEDULED" }
            : appt
        )
      );
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  
  const prescriptions = [
    { id: 1, medicine: "Amoxicillin", dosage: "500mg", frequency: "3 times daily"  },
    { id: 2, medicine: "Ibuprofen", dosage: "400mg", frequency: "As needed" }
  ];

  const profile = {
    name: "John Doe",
    age: 35,
    bloodGroup: "A+",
    phone: "+1 234 567 8900",
    email: "john.doe@example.com",
    address: "123 Medical Street, Healthcare City"
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8800/all');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePDF = (prescription) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(`Prescription - ${prescription.medicine}`, 10, 10);

    doc.setFontSize(12);
   
    doc.text(`Doctor: ${prescription.doctor}`, 10, 40);

    const data = [
        ["Medicine", "Dosage", "Frequency"],
        [prescription.medicine, prescription.dosage, prescription.frequency],
    ];

    doc.autoTable({
        body: data,
        startY: 60,
    });

    doc.save(`prescription_${prescription.medicine}.pdf`);
};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-8">HMS Portal</h2>
          <div className="space-y-2">
           
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'prescriptions' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Prescriptions
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center w-full px-4 py-2 rounded-lg ${activeTab === 'doctors' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <MdMedicalServices className="mr-2 h-4 w-4" />
              Doctors
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 rounded-lg hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <Link to="/appointment" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </div>

          {/* Search Bar */}
          {activeTab === 'doctors' && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="grid gap-6">
            {activeTab === 'appointments' && (
             <div className="p-6 bg-white rounded-lg shadow-xl">
             <h2 className="text-2xl font-bold mb-6 text-gray-800 animate-fade-in">
               Appointments Dashboard
             </h2>
             
             <div className="space-y-4">
               {appointments.map((appointment) => (
                 <div
                   key={appointment.id}
                   className="bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
                   style={{
                     transform: expandedId === appointment.id ? 'scale(1.02)' : 'scale(1)',
                     transition: 'transform 0.3s ease'
                   }}
                 >
                   <div 
                     className="flex items-center justify-between p-4 cursor-pointer"
                     onClick={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)}
                   >
                     <div className="flex items-center space-x-4">
                       {expandedId === appointment.id ? 
                         <MinusCircle className="text-gray-600 w-5 h-5" /> : 
                         <PlusCircle className="text-gray-600 w-5 h-5" />
                       }
                       <div className="flex items-center space-x-2">
                         <Calendar className="text-blue-500 w-4 h-4" />
                         <span className="text-gray-700">{appointment.appointmentDate}</span>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Clock className="text-green-500 w-4 h-4" />
                         <span className="text-gray-700">{appointment.appointmentTime}</span>
                       </div>
                     </div>
                     <div className="flex items-center space-x-4">
                       <span className={`px-3 py-1 rounded-full text-sm ${
                         appointment.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                         appointment.status === 'RESCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
                         'bg-gray-100 text-gray-800'
                       }`}>
                         {appointment.status}
                       </span>
                     </div>
                   </div>
       
                   <div className={`overflow-hidden transition-all duration-300 ${
                     expandedId === appointment.id ? 'max-h-96' : 'max-h-0'
                   }`}>
                     <div className="p-4 bg-white border-t border-gray-100">
                       <div className="grid grid-cols-2 gap-4 mb-4">
                         <div className="flex items-center space-x-2">
                           <User className="text-gray-500 w-4 h-4" />
                           <span className="text-gray-600">Patient:</span>
                           <span className="font-medium">{appointment.patient.name}</span>
                         </div>
                         <div className="flex items-center space-x-2">
                           <User className="text-gray-500 w-4 h-4" />
                           <span className="text-gray-600">Doctor:</span>
                           <span className="font-medium">{appointment.doctor.name}</span>
                         </div>
                         
                       </div>
                       
                       <div className="flex space-x-3">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleCancel(appointment.id);
                           }}
                           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                         >
                           Cancel
                         </button>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleReschedule(appointment.id);
                           }}
                           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                         >
                           Reschedule
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
            )}

{activeTab === 'prescriptions' && (
                            <div className="bg-white rounded-lg border p-6">
                                <h2 className="text-xl font-semibold mb-6">Current Prescriptions</h2>
                                <div className="grid gap-4">
                                    {prescriptions.map(prescription => (
                                        <div key={prescription.id} className="p-4 border rounded-lg">
                                          <div className="text-sm text-gray-500">
                        <p>Dosage: {prescription.dosage}</p>
                        <p>Frequency: {prescription.frequency}</p>
                      </div>
                                            {/* ... (Prescription details - same as before) */}
                                            <button
                                                onClick={() => generatePDF(prescription)}
                                                className="mt-2 flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

            {activeTab === 'doctors' && (
               <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
               <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Specialists</h2>
               
               {filteredDoctors.length === 0 ? (
                 <p className="text-gray-600 text-center py-8">No doctors found.</p>
               ) : (
                 <motion.div
                   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                   variants={containerVariants}
                   initial="hidden"
                   animate="visible"
                 >
                   {filteredDoctors.map((doctor) => (
                     <motion.div
                       key={doctor.id}
                       variants={itemVariants}
                       whileHover={{ y: -8 }}
                       className="relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                     >
                       {/* Top Gradient Bar */}
                       <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
                       
                       <div className="p-6">
                         {/* Header with Image and Specialty */}
                         <div className="flex justify-between items-start mb-4">
                           <div className="relative">
                             <img
                               src={doctor.image}
                               alt={doctor.name}
                               className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                             />
                             <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                               Available
                             </span>
                           </div>
                           <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                             {doctor.specialization}
                           </span>
                         </div>
         
                         {/* Doctor Info */}
                         <div className="mb-4">
                           <h3 className="text-xl font-bold text-gray-800 mb-1">{doctor.name}</h3>
                           <p className="text-gray-600 text-sm">{doctor.qualification}</p>
                         </div>
         
                         {/* Stats */}
                         <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="flex items-center space-x-2">
                             <Award className="w-5 h-5 text-blue-500" />
                             <span className="text-gray-600 text-sm">{doctor.experience} Years Exp.</span>
                           </div>
                           <div className="flex items-center space-x-2">
                             <Clock className="w-5 h-5 text-blue-500" />
                             <span className="text-gray-600 text-sm">{doctor.workingHours}</span>
                           </div>
                         </div>
         
                         {/* Contact Info */}
                         <div className="mb-6 py-3 px-4 bg-gray-50 rounded-lg">
                           <div className="flex items-center space-x-2 text-gray-600">
                             <Phone className="w-4 h-4 text-blue-500" />
                             <span className="text-sm">{doctor.phone_number}</span>
                           </div>
                         </div>
                         <div className="mb-6 py-3 px-4 bg-gray-50 rounded-lg">
                           <div className="flex items-center space-x-2 text-gray-600">
                             <IndianRupee className="w-4 h-4 text-blue-500" />
                             <span className="text-sm">{doctor.fees}</span>
                           </div>
                         </div>
         
                         {/* Action Buttons */}
                         <div className="flex gap-3">
                           <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                             <Calendar className="w-4 h-4" />
                             <span><Link to="/appointment">Appointment</Link></span>
                           </button>
                          
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </motion.div>
               )}
             </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p>{profile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p>{profile.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blood Group</label>
                    <p>{profile.bloodGroup}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p>{profile.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p>{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p>{profile.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;