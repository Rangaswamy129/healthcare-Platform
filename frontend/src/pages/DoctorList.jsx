import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors")
      .then(res => setDoctors(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Doctors List</h2>
      {doctors.map(doc => (
        <div key={doc._id} style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
          <h3>{doc.specialization}</h3>
          <p>Experience: {doc.experience} years</p>
          <Link to={`/appointment/${doc._id}`}>Book Appointment</Link>
        </div>
      ))}
    </div>
  );
}
