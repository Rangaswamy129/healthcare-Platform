import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";


const API = process.env.REACT_APP_API_URL;



const socket = io(API);

export default function VideoRoom({ roomId, inCall }) {
  const myVideo = useRef();
  const userVideo = useRef();
  const peerRef = useRef();
  const localStreamRef = useRef();
  const currentCallRef = useRef();

  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [doctorOnline, setDoctorOnline] = useState(false);

  useEffect(() => {
    if (!inCall) {
      cleanup();
      return;
    }

    const peer = new Peer(undefined, {
      host: "/",
      port: 3001,
      path: "/peerjs",
    });

    peerRef.current = peer;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (myVideo.current) myVideo.current.srcObject = stream;

        // Answer incoming call
        peer.on("call", (call) => {
          call.answer(stream);
          currentCallRef.current = call;
          setDoctorOnline(true);

          call.on("stream", (userStream) => {
            if (userVideo.current)
              userVideo.current.srcObject = userStream;
          });
        });

        // When another user joins
        socket.on("user-connected", (peerId) => {
          const call = peer.call(peerId, stream);
          currentCallRef.current = call;
          setDoctorOnline(true);

          call.on("stream", (userStream) => {
            if (userVideo.current)
              userVideo.current.srcObject = userStream;
          });
        });

        socket.on("user-disconnected", () => {
          setDoctorOnline(false);
          if (userVideo.current) userVideo.current.srcObject = null;
        });
      })
      .catch((err) => console.error("Media error:", err));

    peer.on("open", (id) => {
      socket.emit("join-room", roomId, id);
    });

    return () => cleanup();
  }, [roomId, inCall]);

  
  // CONTROL FUNCTIONS
 

  const toggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const toggleScreenShare = async () => {
    if (!isSharing) {
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({ video: true });

      const screenTrack = screenStream.getVideoTracks()[0];

      replaceVideoTrack(screenTrack);

      screenTrack.onended = () => {
        toggleScreenShare();
      };

      setIsSharing(true);
    } else {
      const videoTrack =
        localStreamRef.current?.getVideoTracks()[0];

      replaceVideoTrack(videoTrack);
      setIsSharing(false);
    }
  };

  const replaceVideoTrack = (newTrack) => {
    const sender =
      currentCallRef.current?.peerConnection
        ?.getSenders()
        .find((s) => s.track.kind === "video");

    if (sender) sender.replaceTrack(newTrack);
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) =>
        track.stop()
      );
      localStreamRef.current = null;
    }

    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (myVideo.current) myVideo.current.srcObject = null;
    if (userVideo.current) userVideo.current.srcObject = null;

    setDoctorOnline(false);
  };

  if (!inCall) return null;

  return (
    <div style={{ textAlign: "center" }}>
      {/* Doctor Status */}
      <h3>
        {doctorOnline
          ? "🟢 Doctor Joined"
          : "🔴 Waiting for Doctor..."}
      </h3>

      {/* Video Section */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <video
          ref={myVideo}
          autoPlay
          muted
          playsInline
          style={{
            width: "300px",
            borderRadius: "10px",
            background: "black",
          }}
        />
        <video
          ref={userVideo}
          autoPlay
          playsInline
          style={{
            width: "300px",
            borderRadius: "10px",
            background: "black",
          }}
        />
      </div>

      {/* Professional Control Bar */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "15px",
          background: "#1f1f1f",
          padding: "15px 25px",
          borderRadius: "50px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.5)",
        }}
      >
        <button onClick={toggleMute}>
          {isMuted ? "🔇 Unmute" : "🎤 Mute"}
        </button>

        <button onClick={toggleCamera}>
          {cameraOn ? "📷 Camera Off" : "📷 Camera On"}
        </button>

        <button onClick={toggleScreenShare}>
          {isSharing ? "🖥 Stop Share" : "🖥 Share Screen"}
        </button>

        <button
          onClick={cleanup}
          style={{ background: "red", color: "white" }}
        >
           End
        </button>
      </div>
    </div>
  );
}
