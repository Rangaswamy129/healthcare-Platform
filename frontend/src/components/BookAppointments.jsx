import { useState } from "react";
import { doctorsData } from "../data/doctorsData";
import { useEffect } from "react";


export default function BookAppointment( { cartDoctors, setCartDoctors  }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState(() => {
  const saved = localStorage.getItem("appointments");
  return saved ? JSON.parse(saved) : [];
});
useEffect(() => {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}, [appointments]);


  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    disorder: "",
    date: "",
    time: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const bookAppointment = () => {
  if (!selectedDoctor || !formData.patientName || !formData.date) {
    alert("Please fill all details!");
    return;
  }

  const newAppointment = {
    id: "APT-" + Date.now(),
  
  
    doctor: selectedDoctor,
    patientName: formData.patientName,
    age: formData.age,
    disorder: formData.disorder,
    date: formData.date,
    time: formData.time,
  };

   setAppointments((prev) => [...prev, newAppointment]);
  alert(" Appointment Booked Successfully!");

  setSelectedDoctor(null);
  setFormData({ patientName: "", age: "", disorder: "", date: "", time: "" });

  

};

const cancelAppointment = (id) => {
  const updatedAppointments = appointments.filter(app => app.id !== id);
  setAppointments(updatedAppointments);
  alert(" Appointment Cancelled Successfully!");
};
 const removeFromCart = (id) => {
    setCartDoctors((prev) => prev.filter((doc) => doc.id !== id));
  };
  return (
    <div>
      <h2>📅 Book Appointment</h2>

      <h2>Selected Doctors for Appointment</h2>

{cartDoctors.length === 0 ? (
  <p> No doctor selected. Please select a doctor from Find Doctors.</p>
) : (
  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
    {cartDoctors.map((doc) => (
      <div
  key={doc.id}
  onClick={() => setSelectedDoctor(doc)}
  style={{
    width: "200px",
    background: selectedDoctor?.id === doc.id ? "#e3f2fd" : "#fff",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    border: "2px solid #1976d2"
  }}
>
    
        <img
          src={doc.image}
          alt={doc.name}
          style={{ width: "60px", height: "60px", borderRadius: "50%" }}
        />
        <h4>{doc.name}</h4>
        <p>{doc.specialization}</p>
        <p>📍 {doc.location}</p>
        <p>💰 ₹{doc.fee}</p>
        <p>⭐ {doc.rating}</p>
       <p>🏥 {doc.hospitalName}</p>
<p>📍 {doc.hospitalAddress}</p>
<p>📞 {doc.contact}</p>
<p>📧 {doc.email}</p>

    
         <button
       onClick={(e) => {
    e.stopPropagation();
    removeFromCart(doc.id);
  }}
        style={{
          marginTop: "10px",
          background: "red",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
         Remove
      </button>
      </div>
    ))}
  </div>
)}


   
      {selectedDoctor && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#f9f9f9",
            borderRadius: "12px",
            maxWidth: "400px"
          }}
        >
          <h3>👨‍⚕️ Doctor: {selectedDoctor.name}</h3>
          <p>Specialization: {selectedDoctor.specialization}</p>
          <p>📍 Location: {selectedDoctor.location}</p>
          <p>Hospital Name:{selectedDoctor.hospitalName}</p>
          <p>Hospital address:{selectedDoctor.hospitalAddress}</p>
          <p>Contact:{selectedDoctor.contact}</p>
            <p>Email:{selectedDoctor.email}</p>
          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
          <input
  type="text"
  name="disorder"
  placeholder="Patient Disorder / Problem"
  value={formData.disorder}
  onChange={handleChange}
  style={{ width: "100%", padding: "8px", margin: "8px 0" }}
/>


          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />

          <button
            onClick={bookAppointment}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
             Confirm Appointment
          </button>

          <button
            onClick={() => setSelectedDoctor(null)}
            style={{ marginTop: "10px", border: "none", color: "red", background: "none" ,cursor: "pointer"}}
          >
             Change Doctor
          </button>
        </div>
      )}

    
      {appointments.length > 0 && (
        <div style={{ marginTop: "25px" }}>
          <h3>📋 Booked Appointments</h3>

          {appointments.map((app) => (
            <div
              key={app.id}
              style={{
                background: "#fff",
                padding: "12px",
                margin: "10px 0",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                👨‍⚕️ {app.doctor.name} <br />
🏥 {app.doctor.specialization} <br />
📍 {app.doctor.location} <br />
💰 Fee: ₹{app.doctor.fee} <br />
⭐ Rating: {app.doctor.rating} <br />
Hospital Name:{app.doctor.hospitalName}<br/>
          Hospital address:{app.doctor.hospitalAddress}<br />
          Contact:{app.doctor.contact}<br />
            Email:{app.doctor.email}<br />
              </div>

              <button
                onClick={() => cancelAppointment(app.id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                 Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}