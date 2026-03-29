import { useEffect, useState } from "react";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("appointments")) || [];
    setRecords(stored);
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>📄 Medical Records</h2>

      {/* 🔹 If no records */}
      {records.length === 0 && (
        <p>No medical records found.</p>
      )}

      {/* 🔹 Show List */}
      {!selectedRecord &&
        records.map((record) => (
          <div
            key={record.id}
            onClick={() => setSelectedRecord(record)}
            style={{
              background: "#f4f8fb",
              padding: "15px",
              marginBottom: "12px",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
            }}
          >
            <h4>👤 {record.patientName}</h4>
            <p>👨‍⚕️ Doctor: {record.doctor.name}</p>
            <p>📅 Date: {record.date}</p>
          </div>
        ))}

      {/* 🔹 Detailed View */}
      {selectedRecord && (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)"
          }}
        >
          <button
            onClick={() => setSelectedRecord(null)}
            style={{
              marginBottom: "15px",
              padding: "6px 12px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            🔙 Back
          </button>

          <h3>👤 Patient Details</h3>
          <p>Name: {selectedRecord.patientName}</p>
          <p>Age: {selectedRecord.age}</p>
          <p>Disorder: {selectedRecord.disorder}</p>

          <hr />

          <h3>👨‍⚕️ Doctor Appointed</h3>
          <p>Name: {selectedRecord.doctor.name}</p>
          <p>Specialization: {selectedRecord.doctor.specialization}</p>
          <p>Location: {selectedRecord.doctor.location}</p>
          <p>Fee: ₹{selectedRecord.doctor.fee}</p>
          <p>Rating: ⭐ {selectedRecord.doctor.rating}</p>
          <p>Hospital: {selectedRecord.doctor.hospitalName}</p>
          <p>Address: {selectedRecord.doctor.hospitalAddress}</p>
          <p>Contact: {selectedRecord.doctor.contact}</p>
          <p>Email: {selectedRecord.doctor.email}</p>

          <hr />

          <h3>📅 Appointment Details</h3>
          <p>Date: {selectedRecord.date}</p>
          <p>Time: {selectedRecord.time}</p>
        </div>
      )}
    </div>
  );
}
