import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const paidDoctor = localStorage.getItem("currentDoctor");
localStorage.setItem("paidDoctor", paidDoctor);

    setTimeout(() => {
      navigate("/video-consultation");
    }, 2000);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Payment Successful </h2>
      <p>Redirecting to Video Consultation...</p>
    </div>
  );
}
