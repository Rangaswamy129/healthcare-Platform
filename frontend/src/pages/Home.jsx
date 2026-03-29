import { useState } from "react";
import { doctorsData } from "../data/doctorsData";
// import { appointmentsData } from "../data/appointmentsData";
// import { videoConsultationData } from "../data/videoConsultationData";
// import { medicalRecordsData } from "../data/medicalRecordData";
import BookAppointment from "../components/BookAppointments";
import VideoConsultation from "../components/VideoConsultation";

import { useEffect } from "react";
// import { Link } from "react-router-dom";


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import { FaHospital } from "react-icons/fa";
import MedicalRecords from "./MedicalRecords";


export default function Home() {
  const [active, setActive] = useState("");
const [selectedDoctor, setSelectedDoctor] = useState(null);
//  const [appointments, setAppointments] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [cartDoctors, setCartDoctors] = useState(() => {
  const saved = localStorage.getItem("cartDoctors");
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem("cartDoctors", JSON.stringify(cartDoctors));
}, [cartDoctors]);


// const addToCart = (doctor) => {
//     const exists = cartDoctors.find((d) => d.id === doctor.id);
//     if (!exists) {
//       setCartDoctors([...cartDoctors, doctor]);
//     }
//   };
  
const renderContent = () => {
  switch (active) {

    case "doctors":
      return (
        <div>
          <h2>👨‍⚕️ Doctors List</h2>
          <input
  type="text"
  placeholder=" Search doctor by name, specialization or location..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    width: "300px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "10px"
  }}
/>

      

        {/* FORCE ROW-WISE LAYOUT */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",   
            gap: "20px",
            marginTop: "20px"
          }}
        >
         {doctorsData
  .filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.location.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((doc) => (
    <div
      key={doc.id}
     onClick={() => {
  const alreadyAdded = cartDoctors.find(d => d.id === doc.id);
  if (!alreadyAdded) {
    setCartDoctors([...cartDoctors, doc]);
    alert("Doctor added to booking list!");
  }
}}

      style={{
        width: "200px",
        background: "#fff",
        padding: "15px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        cursor: "pointer"
      }}
    >
      <img
        src={doc.image}
        alt={doc.name}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />
      <h4>{doc.name}</h4>
      <p>{doc.specialization}</p>
      <p style={{ fontSize: "13px", color: "gray" }}>📍 {doc.location}</p>
        <p style={{ fontWeight: "bold", color: "#1976d2" }}>
    💰 ₹{doc.fee}
  </p>

  <p style={{ color: "orange" }}>
    ⭐ {doc.rating}
  </p>
    </div>
  ))}

        </div>

        {/* Doctor Details */}
        {selectedDoctor && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#f5f5f5",
              borderRadius: "10px"
            }}
          >
            <h3>Doctor Details</h3>
            <p><b>Name:</b> {selectedDoctor.name}</p>
            <p><b>Specialization:</b> {selectedDoctor.specialization}</p>
            <p><b>Experience:</b> {selectedDoctor.experience}</p>
            <p><b>Location:</b> {selectedDoctor.location}</p>
              <p><b>Consultation Fee:</b> ₹{selectedDoctor.fee}</p>
    <p><b>Rating:</b> ⭐ {selectedDoctor.rating}</p>
     <p><b>Hospital Name:</b> ⭐ {selectedDoctor.hospitalName}</p>
<p><b>Hospital Address:</b> ⭐ {selectedDoctor.hospitalAddress}</p>
<p><b>Contact:</b> ⭐ {selectedDoctor.contact}</p>
<p><b>Email:</b> ⭐ {selectedDoctor.email}</p>

            <button onClick={() => setSelectedDoctor(null)}>Close</button>
          </div>
        )}
      </div>
      );

    case "appointments":
      return (
        <div>
          
          {active === "appointments" && <BookAppointment cartDoctors={cartDoctors}    setCartDoctors={setCartDoctors}/>}
       

        </div>
      );

    case "video":
      return (
        <div>
          <h3>🎥 Video Consultations</h3>
            {active === "video" && <VideoConsultation cartDoctors={cartDoctors} />}

        </div>
      );

    case "records":
     
  return <MedicalRecords />;


    default:
      return <p>👉 Click a button to see details.</p>;
  }
};
  
  return (
    <div style={{ padding: "40px" }}>
      <h1
  style={{
    color: "#19d247",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
><FaHospital size={35} style={{ animation: "pulse 2s infinite" }} /> Healthcare Platform
</h1>
      <div style={{ padding: "20px" }}>

 <Swiper
    modules={[Autoplay, Pagination, Navigation]}
    spaceBetween={30}
    slidesPerView={1}
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
    }}
    pagination={{ clickable: true }}
    navigation
    style={{ borderRadius: "12px", overflow: "hidden" }}
  >
    {/* Banner 1 */}
    

    {/* Banner 2 */}
    <SwiperSlide>
      <a href="/pharmacy">
        <img
        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80"

         

          alt="Pharmacy Discount"
          style={{
            width: "100%",
            height: "650px",
            objectFit: "cover",
          }}
        />
      </a>
    </SwiperSlide>

    {/* Banner 3 */}
    <SwiperSlide>
      <a href="/lab-tests">
        <img
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
          
          alt="Lab Test Offer"
          style={{
            width: "200%",
            height: "650px",
            objectFit: "cover",
          }}
        />
      </a>
    </SwiperSlide>
     <SwiperSlide>
      <a href="/lab-tests">
        <img
          src="https://images.unsplash.com/photo-1580281657521-6c6f66a5b1e3?auto=format&fit=crop&w=1200&q=80"
          alt="Lab Test Offer"
          style={{
            width: "200%",
            height: "650px",
            objectFit: "cover",
          }}
        />
      </a>
    </SwiperSlide>
  </Swiper>
</div>

      <p>Choose a service below:</p>

      {/* Buttons */}
     <div className="btn-group">
  <button onClick={() => setActive("doctors")}>👨‍⚕️ Find Doctors</button>
  <button onClick={() => setActive("appointments")}>📅 Book Appointments</button>
  <button onClick={() => setActive("video")}>🎥 Video Consultation</button>
  <button onClick={() => setActive("records")}>📄 Medical Records</button>
</div>

      {/* Dynamic Content */}
      {renderContent()}
    </div>
    
  );
}
