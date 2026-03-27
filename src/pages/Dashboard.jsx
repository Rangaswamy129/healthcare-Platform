import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("appointments");
    if (saved) {
      setAppointments(JSON.parse(saved));
    }
  }, []);
  
  
 const downloadAppointment = async (app) => {
  try {
    const doc = new jsPDF();

    // Generate QR as base64 image
    const qrData = `Appointment ID: ${app.id}
Patient: ${app.patientName}
Doctor: ${app.doctor.name}
Date: ${app.date}`;

    const qrImage = await QRCode.toDataURL(qrData);

    // Title
    doc.setFontSize(18);
    doc.text("Healthcare Appointment Letter", 20, 20);

    // Appointment Details
    doc.setFontSize(12);
    doc.text(`Appointment ID: ${app.id}`, 20, 40);
    doc.text(`Patient Name: ${app.patientName}`, 20, 50);
    doc.text(`Doctor Name: ${app.doctor.name}`, 20, 60);
    doc.text(`Specialization: ${app.doctor.specialization}`, 20, 70);
    doc.text(`Date: ${app.date}`, 20, 80);
    doc.text(`Time: ${app.time}`, 20, 90);
    doc.text(`Status: Confirmed`, 20, 100);

    // Add QR image
    doc.addImage(qrImage, "PNG", 140, 40, 40, 40);

    // Save
    doc.save(`Appointment_${app.id}.pdf`);
  } catch (error) {
    console.error("QR Error:", error);
  }
};

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Dashboard</h2>

      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        appointments.map((app) => (
          <div
            key={app.id}
            style={{
              background: "#f5f5f5",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "10px",
            }}
          >
            <h3>📄 Appointment Letter</h3>
           
            <button
  onClick={() => downloadAppointment(app)}
 style={{
  background: "#ffffff",
  padding: "20px",
  margin: "15px 0",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  borderLeft: "6px solid #1976d2"
}}
>
  ⬇ Download Appointment Letter
</button>

          </div>
        ))
      )}
    </div>
  );
}
