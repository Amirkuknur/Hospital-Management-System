import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaUserInjured, FaCalendarAlt, FaSignOutAlt, FaPlus } from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false); // State for form visibility
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    specialization: '',
    qualification: '',
    experience: '',
    image: '',
    role: 'DOCTOR', // Default role for doctors
  }); // State for new doctor data

  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8800/all", axiosConfig);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8800/staff/users", axiosConfig);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated. Please log in.");
      }

      const response = await fetch("http://localhost:8800/staff/admin/appointments", {
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8800/staff/admin/appointment/${id}`, {
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

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert(error.message);
    }
  };

  const handleCancelUser = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8800/staff/admin/deleteuser/${id}`, {
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

      setPatients((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error("Error Deleting the User:", error);
      alert(error.message);
    }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddDoctorClick = () => {
    setShowAddDoctorForm(!showAddDoctorForm); // Toggle form visibility
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value }); // Update new doctor state
  };

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/doctor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newDoctor),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add doctor: ${errorText}`);
      }

      const data = await response.json();
      alert("Doctor added successfully!");
      setDoctors([...doctors, data]); // Add new doctor to the list
      setShowAddDoctorForm(false); // Hide the form
      setNewDoctor({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        specialization: '',
        qualification: '',
        experience: '',
        image: '',
        fees:'',
        role: 'DOCTOR',
      }); // Reset form
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert(error.message);
    }
};


  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-blue-900 shadow-lg z-20 p-4">
        <h1 className="text-xl font-bold text-white mb-6">Admin Dashboard</h1>
        <nav className="space-y-2">
          <button onClick={fetchDoctors} className="flex items-center w-full px-4 py-2 text-white hover:bg-blue-800 rounded-md transition-colors duration-300">
            <FaUserMd className="mr-3" /> Doctors
          </button>
          <button onClick={fetchPatients} className="flex items-center w-full px-4 py-2 text-white hover:bg-blue-800 rounded-md transition-colors duration-300">
            <FaUserInjured className="mr-3" /> Patients
          </button>
          <button onClick={fetchAppointments} className="flex items-center w-full px-4 py-2 text-white hover:bg-blue-800 rounded-md transition-colors duration-300">
            <FaCalendarAlt className="mr-3" /> Appointments
          </button>
        </nav>
        <button onClick={handleLogout} className="mt-6 flex items-center w-full px-4 py-2 text-white hover:bg-red-600 rounded-md transition-colors duration-300">
          <FaSignOutAlt className="mr-3" /> Logout
        </button>
      </div>
      <div className="flex-1 flex flex-col md:pl-64 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Overview</h2>

        {/* Add Doctor Button and Form */}
        <div className="mb-6">
          <button
            onClick={handleAddDoctorClick}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            <FaPlus className="mr-2" /> Add Doctor
          </button>

          {showAddDoctorForm && (
            <div className="mt-4 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Doctor</h3>
              <form onSubmit={handleAddDoctorSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newDoctor.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newDoctor.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newDoctor.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={newDoctor.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={newDoctor.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={newDoctor.qualification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={newDoctor.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={newDoctor.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Fees</label>
                  <input
                    type="text"
                    name="fees"
                    value={newDoctor.fees}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                  <select
                    name="role"
                    value={newDoctor.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DOCTOR">Doctor</option>
                   
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Add Doctor
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Doctors Table */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Doctors</h3>
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Specialization</th>
                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-t hover:bg-gray-50 transition-colors duration-300">
                  <td className="px-4 py-2 text-gray-700">{doctor.id}</td>
                  <td className="px-4 py-2 text-gray-700">{doctor.name}</td>
                  <td className="px-4 py-2 text-gray-700">{doctor.specialization}</td>
                  <td className="px-4 py-2 text-gray-700">{doctor.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelDoctor(doctor.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Patients Table */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Patients</h3>
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Age</th>
                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-gray-600">Password</th>
                <th className="px-4 py-2 text-left text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-t hover:bg-gray-50 transition-colors duration-300">
                  <td className="px-4 py-2 text-gray-700">{patient.id}</td>
                  <td className="px-4 py-2 text-gray-700">{patient.name}</td>
                  <td className="px-4 py-2 text-gray-700">{patient.age}</td>
                  <td className="px-4 py-2 text-gray-700">{patient.email}</td>
                  <td className="px-4 py-2 text-gray-700">{patient.password}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelUser(patient.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Appointments Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Appointments</h3>
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">ID</th>
                <th className="px-4 py-2 text-left text-gray-600">Patient</th>
                <th className="px-4 py-2 text-left text-gray-600">Doctor</th>
                <th className="px-4 py-2 text-left text-gray-600">Date</th>
                <th className="px-4 py-2 text-left text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t hover:bg-gray-50 transition-colors duration-300">
                  <td className="px-4 py-2 text-gray-700">{appointment.patient.id}</td>
                  <td className="px-4 py-2 text-gray-700">{appointment.patient.name}</td>
                  <td className="px-4 py-2 text-gray-700">{appointment.doctor.name}</td>
                  <td className="px-4 py-2 text-gray-700">{appointment.appointmentDate}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(appointment.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;