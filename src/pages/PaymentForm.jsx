import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();
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
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Step 1: Schedule Appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      handlePayment(token); // ✅ Proceed to Payment After Scheduling
    } catch (error) {
      alert("Error scheduling appointment: " + (error.response?.data || "Try again later."));
    }
  };

  
  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post("http://localhost:8800/payment/createOrder", {
        amount: 100 * 100, // Convert INR to paise
        currency: "INR",
        receipt: "receipt#1",
      });

      const { id: order_id, amount, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_AakJ35QALv6dkH", // Use Razorpay test key
        amount,
        currency,
        name: "Your Company",
        description: "Test Transaction",
        order_id,
        handler: (response) => {
          alert("Payment Successful!");
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
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
              <input
                type="text"
                name="doctorName"
                placeholder="Enter doctor's name"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
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
