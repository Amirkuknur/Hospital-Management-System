import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHospital } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "USER",
    name: "",
    email: "",
    password: "",
    phone_number: "",
    image: "",
    age: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const res = await axios.post(
            "http://localhost:8800/register",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // If cookies or sessions are used
            }
        );
        alert(res.data); // OTP Sent Message
        setOtpSent(true);
    } catch (error) {
        alert("Registration Failed: " + (error.response?.data || "Unknown error"));
    }
};


  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:8800/verify", {}, {
        params: {
          email: formData.email,
          otp: otp
        }
      });
      alert(res.data); // OTP Verified Message
      navigate("/login"); // Redirect after successful verification
    } catch (error) {
      alert("OTP Verification Failed: " + error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FaHospital className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {otpSent ? "Enter OTP" : "Create your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!otpSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="USER">USER</option>
                </select>
              </div>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="number"
                  required
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
                Register
              </button>
              
              <div className="mt-6">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50"
                >
                  Already Have an Account
                </button>
              </div>
            </form>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button onClick={handleVerifyOtp} className="w-full bg-green-600 text-white py-2 mt-4 rounded-md">
                Verify OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
