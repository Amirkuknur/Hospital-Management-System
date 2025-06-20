import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    doctorName: "",
    appointmentTime: "",
    prescription: "",
    doctorNotes: "",
    virtualLink: "",
  });

  useEffect(() => {
    loadRazorpayScript();
    fetchDoctors();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8800/all');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // When doctor name changes, find and set the selected doctor
    if (name === 'doctorName') {
      const doctor = doctors.find(doc => doc.name === value);
      setSelectedDoctor(doctor);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      alert("Please select a valid doctor");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8800/user/schedule",
        null,
        {
          params: formData,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Appointment scheduled successfully!");
      handlePayment(token, selectedDoctor.fees);
    } catch (error) {
      alert("Error scheduling appointment: " + (error.response?.data || "Try again later."));
    }
  };

  const handlePayment = async (token, fees) => {
    try {
      const orderResponse = await axios.post("http://localhost:8800/payment/createOrder", {
        amount: fees, // Convert doctor's fees to paise
        currency: "INR",
        receipt: "receipt#1",
      });

      const { id: order_id, amount, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_AakJ35QALv6dkH",
        amount,
        currency,
        name: "HMS Portal",
        description: `Appointment with ${formData.doctorName}`,
        order_id,
        handler: (response) => {
          alert("Payment Successful!");
          navigate('/dashboard'); // Redirect to dashboard after successful payment
        },
        prefill: {
          name: formData.userName,
          email: "", // You can add email to formData if needed
          contact: "", // You can add contact to formData if needed
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Failed:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Schedule Your Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <input
                type="text"
                name="userName"
                placeholder="Enter your name"
                value={formData.userName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
              <select
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name} - {doctor.specialization} (₹{doctor.fees})
                  </option>
                ))}
              </select>
            </div>
            {selectedDoctor && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Consultation Fee: ₹{selectedDoctor.fees}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
              <input
                type="datetime-local"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prescription (Optional)</label>
              <input
                type="text"
                name="prescription"
                placeholder="Enter prescription"
                value={formData.prescription}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Notes (Optional)</label>
              <input
                type="text"
                name="doctorNotes"
                placeholder="Enter doctor's notes"
                value={formData.doctorNotes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Virtual Link (Optional)</label>
              <input
                type="text"
                name="virtualLink"
                placeholder="Enter virtual meeting link"
                value={formData.virtualLink}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Schedule Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;