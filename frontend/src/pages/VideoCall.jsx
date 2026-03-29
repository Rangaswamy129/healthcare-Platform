import { useParams } from "react-router-dom";

export default function VideoCall() {
  const { id } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h2>Video Consultation Room</h2>
      <p>Appointment ID: {id}</p>
      <p>🎥 Video call feature will be implemented using WebRTC / Socket.io.</p>
    </div>
  );
}
