import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Appointment() {
  const { id } = useParams();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const bookAppointment = async () => {
    try {
      await axios.post("http://localhost:5000/api/appointments", {
        doctorId: id,
        date,
        time,
      });
      alert("Appointment Booked!");
    } catch (err) {
      alert("Booking Failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Book Appointment</h2>
      <input type="date" onChange={e => setDate(e.target.value)} /><br /><br />
      <input type="time" onChange={e => setTime(e.target.value)} /><br /><br />
      <button onClick={bookAppointment}>Book</button>
    </div>
  );
}
