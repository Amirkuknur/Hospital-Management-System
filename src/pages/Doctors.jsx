import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8800/doctor');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Doctors List</h2>
      {doctors.length === 0 ? (
        <p className="text-gray-600">No doctors available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="p-4 border rounded-lg shadow">
              <img src={doctor.image} alt={doctor.name} className="w-32 h-32 object-cover rounded-full mx-auto" />
              <h3 className="text-xl font-semibold text-center mt-2">{doctor.name}</h3>
              <p className="text-gray-600 text-center">{doctor.specialization}</p>
              <p className="text-gray-500 text-center">{doctor.qualification}</p>
              <p className="text-gray-700"><strong>Experience:</strong> {doctor.experience} years</p>
              <p className="text-gray-700"><strong>Phone:</strong> {doctor.phone_number}</p>
              
              <p className="text-gray-600"><strong>Working Hours:</strong> {doctor.workingHours}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
