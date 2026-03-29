import { useState, useEffect,useRef } from "react";
import { doctorsData } from "../data/doctorsData";

import { loadStripe } from "@stripe/stripe-js";
import VideoRoom from "./VideoRoom";


  // const stripePromise = loadStripe("pk_test_51T0HsHJFryXmiqadLC9xUefHKOZBlqtf53tERMvQbmOlQvltBUiINNulAHli4rfxcCDjFZYm2MKS19zX7pu6nYD400UmrfJHan");


export default function VideoConsultation() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [inCall, setInCall] = useState(false);
const streamRef = useRef(null);



  
const [paymentDone, setPaymentDone] = useState(false);

const localVideoRef = useRef(null);
const [callTime, setCallTime] = useState(0);
const [timerInterval, setTimerInterval] = useState(null);

const handlePayment = async () => {
  try {
    if (!selectedDoctor) {
      alert("Please select a doctor first");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/payments/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorName: selectedDoctor.name,
          amount: Number(selectedDoctor.fee),
        }),
      }
    );

    const data = await response.json();
    console.log("Stripe response:", data);
    localStorage.setItem("currentDoctor", selectedDoctor.name);


    if (data.url) {
      window.location.href = data.url;  
    } else {
      alert("Payment session failed.");
    }

  } catch (error) {
    console.error("FULL FRONTEND ERROR:", error);
    alert("Payment failed. Check backend.");
  }
};




useEffect(() => {
  const status = localStorage.getItem("paymentStatus");
  if (status === "success") {
    setPaymentDone(true);
  }
}, []);



  const [videoHistory, setVideoHistory] = useState(() => {
    const saved = localStorage.getItem("videoHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("videoHistory", JSON.stringify(videoHistory));
  }, [videoHistory]);

useEffect(() => {
  if (!selectedDoctor) return;

  const paidDoctor = localStorage.getItem("paidDoctor");

  if (paidDoctor === selectedDoctor.name) {
    setPaymentDone(true);
  } else {
    setPaymentDone(false);
  }
}, [selectedDoctor]);




  // Filter Logic
  const filteredDoctors = doctorsData.filter((doc) => {
    return (
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (specializationFilter
        ? doc.specialization === specializationFilter
        : true) &&
      (ratingFilter ? doc.rating >= Number(ratingFilter) : true)
    );
  });

 const startConsultation = async () => {
  try {
    if (!selectedDoctor) {
      alert("Select doctor");
      return;
    }

    if (!selectedSlot) {
      alert("Select time slot");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;

    setInCall(true);

    // Wait for video element to render
    setTimeout(() => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true; // important
        localVideoRef.current.play().catch(err =>
          console.log("Play error:", err)
        );
      }
    }, 300);

    // Start timer
    const interval = setInterval(() => {
      setCallTime((prev) => prev + 1);
    }, 1000);

    setTimerInterval(interval);

  } catch (error) {
    console.error("Camera error:", error);
    alert("Camera access failed");
  }
};


const endCall = () => {
  setInCall(false);

  if (timerInterval) {
    clearInterval(timerInterval);
    setTimerInterval(null);
  }

  setCallTime(0);

  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }

  if (localVideoRef.current) {
    localVideoRef.current.srcObject = null;
  }
};





  return (
    <div>
      <h2>🎥 Video Consultation</h2>

      {/* Search + Filters */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
        <input
          type="text"
          placeholder="Search Doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", flex: "1" }}
        />

        <select
          value={specializationFilter}
          onChange={(e) => setSpecializationFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Specializations</option>
          {[...new Set(doctorsData.map((d) => d.specialization))].map(
            (spec, i) => (
              <option key={i} value={spec}>
                {spec}
              </option>
            )
          )}
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Ratings</option>
          <option value="4">4⭐ & Above</option>
          <option value="4.5">4.5⭐ & Above</option>
        </select>
      </div>

      {/*  Doctor List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {filteredDoctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              style={{
                width: "220px",
                padding: "15px",
                borderRadius: "10px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                border:
                  selectedDoctor?.id === doc.id
                    ? "2px solid #1976d2"
                    : "1px solid #ddd"
              }}
              onClick={() => {
                setSelectedDoctor(doc);
                setSelectedSlot("");
                setInCall(false);
              }}
            >
              <img
                src={doc.image}
                alt={doc.name}
                style={{ width: "70px", borderRadius: "50%" }}
              />
              <h4>{doc.name}</h4>
              <p>{doc.specialization}</p>
              <p>⭐ {doc.rating}</p>
              <p>💰 ₹{doc.fee}</p>
            </div>
          ))
        )}
      </div>

      {/* Time Slots */}
      {selectedDoctor && (
        <div style={{ marginTop: "20px" }}>
          <h3>Select Time Slot for {selectedDoctor.name}</h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {selectedDoctor.availableSlots?.map((slot, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlot(slot)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border:
                    selectedSlot === slot
                      ? "2px solid #1976d2"
                      : "1px solid #ccc",
                  background:
                    selectedSlot === slot ? "#e3f2fd" : "#f9f9f9",
                  cursor: "pointer"
                }}
              >
                {slot}
              </button>
            ))}
          </div>

          {/*  Start Video Call Button */}
{!paymentDone ? (
  <button
    onClick={handlePayment}
    style={{
      marginTop: "20px",
      padding: "10px 20px",
      background: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    💳 Proceed to Payment (₹{selectedDoctor.fee})
  </button>
) : (
  <button
    onClick={startConsultation}
    disabled={!selectedSlot}
    style={{
      marginTop: "20px",
      padding: "10px 20px",
      background: selectedSlot ? "#1976d2" : "#ccc",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: selectedSlot ? "pointer" : "not-allowed"
    }}
  >
    📹 Start Video Call
  </button>
)}


        </div>
      )}

    {/*  Mock Video Call Screen */}
{inCall && selectedDoctor && (
  <div
    style={{
      marginTop: "30px",
      padding: "20px",
      background: "#111",
      color: "white",
      borderRadius: "12px",
      textAlign: "center"
    }}
  >
    <h3> Live with {selectedDoctor.name}</h3>
<VideoRoom roomId={selectedDoctor.id.toString()}
  inCall={inCall} />
    {/* Call Timer */}
    <p>⏱ Call Duration: {Math.floor(callTime / 60)}:
      {(callTime % 60).toString().padStart(2, "0")}
    </p>

   <video
  ref={localVideoRef}
  autoPlay
  playsInline
  muted
  style={{
    width: "100%",
    maxWidth: "500px",
    borderRadius: "10px",
    backgroundColor: "black"
  }}
/>

    <button
     onClick={endCall}
      style={{
        marginTop: "20px",
        background: "red",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      End Call
    </button>
  </div>
)}

      {/* Consultation History */}
      {videoHistory.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>📋 Video Consultation History</h3>
          {videoHistory.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "10px",
                background: "#fff",
                margin: "10px 0",
                borderRadius: "8px"
              }}
            >
              👨‍⚕️ {item.doctor.name} <br />
              🕒 {item.slot} <br />
              📅 {item.date}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
