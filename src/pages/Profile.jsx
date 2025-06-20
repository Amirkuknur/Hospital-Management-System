// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardContent } from 'react-icons/fa';
// // import { Button } from  'react-icons/fa';
// import { Input } from  'react-icons/fa';

// const PatientProfile = () => {
//   const [patient, setPatient] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     age: ''
//   });

//   useEffect(() => {
//     fetchPatientData();
//   }, []);

//   const fetchPatientData = async () => {
//     try {
//       const response = await fetch('http://localhost:8800/staff/admin/users', {
      
//       });
//       const data = await response.json();
//       setPatient(data);
//       setFormData(data);
//     } catch (error) {
//       console.error('Error fetching patient data:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:8080/api/patient/update', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(formData)
//       });
      
//       if (response.ok) {
//         setPatient(formData);
//         setIsEditing(false);
//       }
//     } catch (error) {
//       console.error('Error updating patient data:', error);
//     }
//   };

//   if (!patient) return <div>Loading...</div>;

//   return (
//     <Card className="w-full max-w-2xl mx-auto mt-6">
//       <CardHeader>
//         <h2 className="text-2xl font-bold">Patient Profile</h2>
//       </CardHeader>
//       <CardContent>
//         {!isEditing ? (
//           <div className="space-y-4">
//             <div><strong>Name:</strong> {patient.name}</div>
//             <div><strong>Email:</strong> {patient.email}</div>
//             <div><strong>Phone:</strong> {patient.phone}</div>
//             <div><strong>Address:</strong> {patient.address}</div>
//             <div><strong>Age:</strong> {patient.age}</div>
//             <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block mb-2">Name</label>
//               <Input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label className="block mb-2">Email</label>
//               <Input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label className="block mb-2">Phone</label>
//               <Input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label className="block mb-2">Address</label>
//               <Input
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div>
//               <label className="block mb-2">Age</label>
//               <Input
//                 name="age"
//                 type="number"
//                 value={formData.age}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="space-x-4">
//               <Button type="submit">Save Changes</Button>
//               <Button 
//                 type="button" 
//                 variant="outline"
//                 onClick={() => {
//                   setIsEditing(false);
//                   setFormData(patient);
//                 }}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PatientProfile;